import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { fetchComments } from "../redux/slices/comments";
import { useParams } from "react-router-dom";

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector((state) => state.posts);
	const { comments } = useSelector((state) => state.comments);
	const { tag } = useParams();
	const isPostsLoading = posts.status === "loading";
	const isTagsLoading = tags.status === "loading";

	const commentCount = (postId) => {
		let count = 0;
		comments.items.forEach((comment) => {
			if (comment.postId == postId) {
				count++;
			}
		});
		return count;
	};

	React.useEffect(() => {
		dispatch(fetchComments());
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, []);

	return (
		<>
			<Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
				<Tab label="Новые" />
				<Tab label="Популярные" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items)
						.filter((obj) => (tag ? obj?.tags.includes(tag) : obj))
						.map((obj, index) =>
							isPostsLoading ? (
								<Post key={index} isLoading={true} />
							) : (
								<Post
									key={obj._id}
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}
									user={obj.user}
									createdAt={obj.createdAt
										.substring(0, obj.createdAt.lastIndexOf(".") - 3)
										.replace(/-/g, "/")
										.replace(/T/g, " ")}
									viewsCount={obj.viewsCount}
									commentsCount={commentCount(obj._id)}
									tags={obj.tags}
									isEditable={userData?._id === obj.user._id}
								/>
							),
						)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock items={comments.items} isLoading={false} from={"Home"} />
				</Grid>
			</Grid>
		</>
	);
};
