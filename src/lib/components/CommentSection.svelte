<script lang="ts">
	import { onMount } from "svelte";

	export let postId: string;

	interface Comment {
		comment_id: string;
		user_id: string;
		content: string;
		status: string;
		created_at: string;
		user?: {
			name: string;
			email: string;
		};
	}

	let comments: Comment[] = [];
	let loading = true;
	let submitting = false;
	let commentText = "";
	let userEmail = "";
	let userName = "";
	let error = "";
	let success = "";

	async function loadComments() {
		try {
			const response = await fetch(`/api/posts/${postId}/comments`);
			const data = await response.json();

			if (data.success) {
				comments = data.comments;
			}
		} catch (err) {
			console.error("Failed to load comments:", err);
		} finally {
			loading = false;
		}
	}

	async function submitComment() {
		if (!commentText.trim() || !userName.trim() || !userEmail.trim()) {
			error = "Please fill in all fields";
			return;
		}

		if (commentText.length < 10) {
			error = "Comment must be at least 10 characters";
			return;
		}

		if (commentText.length > 1000) {
			error = "Comment must be less than 1000 characters";
			return;
		}

		submitting = true;
		error = "";
		success = "";

		try {
			const response = await fetch(`/api/posts/${postId}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: commentText,
					name: userName,
					email: userEmail,
				}),
			});

			const data = await response.json();

			if (data.success) {
				success = "Comment submitted! It will appear after moderation.";
				commentText = "";
				await loadComments();
			} else {
				error = data.message || "Failed to submit comment";
			}
		} catch (err) {
			error = "Failed to submit comment. Please try again.";
			console.error("Submit error:", err);
		} finally {
			submitting = false;
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString();
	}

	onMount(() => {
		loadComments();
	});
</script>

<section class="comment-section">
	<h2 class="section-title">Comments ({comments.length})</h2>

	<div class="comment-form-card">
		<h3>Leave a Comment</h3>

		{#if success}
			<div class="alert alert-success">{success}</div>
		{/if}

		{#if error}
			<div class="alert alert-error">{error}</div>
		{/if}

		<form on:submit|preventDefault={submitComment}>
			<div class="form-row">
				<div class="form-group">
					<label for="name">Name</label>
					<input
						type="text"
						id="name"
						bind:value={userName}
						placeholder="Your name"
						required
						disabled={submitting}
					/>
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						bind:value={userEmail}
						placeholder="your@email.com"
						required
						disabled={submitting}
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="comment">Comment</label>
				<textarea
					id="comment"
					bind:value={commentText}
					placeholder="Share your thoughts..."
					rows="4"
					required
					disabled={submitting}
				></textarea>
				<div class="char-count">{commentText.length}/1000</div>
			</div>

			<button type="submit" class="submit-btn" disabled={submitting}>
				{submitting ? "Submitting..." : "Post Comment"}
			</button>
		</form>
	</div>

	<div class="comments-list">
		{#if loading}
			<div class="loading">Loading comments...</div>
		{:else if comments.length === 0}
			<div class="no-comments">
				<p>No comments yet. Be the first to comment!</p>
			</div>
		{:else}
			{#each comments as comment}
				<div class="comment-card">
					<div class="comment-header">
						<div class="user-avatar">
							{comment.user?.name?.[0]?.toUpperCase() || "?"}
						</div>
						<div class="user-info">
							<div class="user-name">
								{comment.user?.name || "Anonymous"}
							</div>
							<div class="comment-date">
								{formatDate(comment.created_at)}
							</div>
						</div>
					</div>
					<div class="comment-content">{comment.content}</div>
				</div>
			{/each}
		{/if}
	</div>
</section>

<style>
	.comment-section {
		max-width: 800px;
		margin: 3rem auto;
		padding: 0 1rem;
	}
	.section-title {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: #1a1a1a;
	}
	.comment-form-card {
		background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.1);
		border: 2px solid #fed7aa;
		margin-bottom: 2rem;
	}
	.comment-form-card h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #c2410c;
		font-family: var(--font-clash-grotesk);
	}
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.form-group label {
		font-weight: 600;
		font-size: 0.9rem;
		color: #7c2d12;
	}
	.form-group input,
	.form-group textarea {
		padding: 0.875rem;
		border: 2px solid #fed7aa;
		border-radius: 10px;
		font-size: 1rem;
		transition: all 0.3s;
		background: white;
	}
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #ea580c;
		box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.1);
		transform: translateY(-1px);
	}
	.form-group textarea {
		resize: vertical;
		min-height: 100px;
		font-family: inherit;
	}
	.char-count {
		text-align: right;
		font-size: 0.85rem;
		color: #9a3412;
		margin-top: 0.25rem;
		font-weight: 500;
	}
	.submit-btn {
		background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
		color: white;
		border: none;
		padding: 1rem 2.5rem;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
		font-family: var(--font-clash-grotesk);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.submit-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(234, 88, 12, 0.4);
	}
	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
	.alert {
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	.alert-success {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #6ee7b7;
	}
	.alert-error {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}
	.comments-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.comment-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.2s;
	}
	.comment-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}
	.comment-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.user-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 700;
		font-size: 1.25rem;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
		font-family: var(--font-clash-grotesk);
	}
	.user-info {
		flex: 1;
	}
	.user-name {
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 0.25rem;
		font-family: var(--font-clash-grotesk);
	}
	.comment-date {
		font-size: 0.85rem;
		color: #9a3412;
		font-weight: 500;
	}
	.comment-content {
		color: #374151;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.loading,
	.no-comments {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}
	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}
		.comment-section {
			margin: 2rem auto;
		}
		.comment-form-card {
			padding: 1.5rem;
		}
		.comment-card {
			padding: 1.25rem;
		}
		.user-avatar {
			width: 40px;
			height: 40px;
			font-size: 1.1rem;
		}
	}
</style>
