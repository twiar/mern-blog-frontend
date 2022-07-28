import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { fetchComments } from "../redux/slices/comments";
import { NavLink, useParams, useLocation } from "react-router-dom";

import "../index.scss";

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector((state) => state.posts);
	const { comments } = useSelector((state) => state.comments);
	const { tag } = useParams();
	const location = useLocation();
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

	const comparePopular = (a, b) => {
		if (a.viewsCount + commentCount(a._id) < b.viewsCount + commentCount(b._id)) {
			return 1;
		}
		if (a.viewsCount + commentCount(a._id) > b.viewsCount + commentCount(b._id)) {
			return -1;
		}
		return 0;
	};

	const compareNewest = (a, b) => {
		let aTime = a.createdAt
			.substring(0, a.createdAt.lastIndexOf(".") - 3)
			.replace(/(-|T|:)/g, "/")
			.split("/");

		let bTime = b.createdAt
			.substring(0, b.createdAt.lastIndexOf(".") - 3)
			.replace(/(-|T|:)/g, "/")
			.split("/");

		let aDate = new Date(aTime[0], aTime[1], aTime[2], aTime[3], aTime[4]);
		let bDate = new Date(bTime[0], bTime[1], bTime[2], bTime[3], bTime[4]);

		let aTimestamp = aDate.getTime();
		let bTimestamp = bDate.getTime();

		if (aTimestamp < bTimestamp) {
			return 1;
		}
		if (aTimestamp > bTimestamp) {
			return -1;
		}
		return 0;
	};

	React.useEffect(() => {
		dispatch(fetchComments());
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, []);

	return (
		<>
			<NavLink to="/" className="navLink">
				Новые
			</NavLink>
			<NavLink to="/popular" className="navLink">
				Популярные
			</NavLink>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading
						? [...Array(5)]
						: location.pathname == "/popular"
						? posts.items.slice().sort(comparePopular)
						: tag
						? posts.items.filter((obj) => obj?.tags.includes(tag))
						: posts.items.slice().sort(compareNewest)
					).map((obj, index) =>
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
