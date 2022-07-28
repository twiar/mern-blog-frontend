import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "../axios";

import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../redux/slices/comments";

export const FullPost = () => {
	const [data, setData] = React.useState();
	const [commentData, setCommentData] = React.useState(null);
	const [isLoading, setLoading] = React.useState(true);
	const { id } = useParams();
	const { comments } = useSelector((state) => state.comments);
	const dispatch = useDispatch();

	const commentCount = (postId) => {
		let count = 0;
		comments.items.forEach((comment) => {
			if (comment.postId == postId) {
				count++;
			}
		});
		return count;
	};

	const commentReceiveData = (data) => {
		setCommentData(data);
	};

	React.useEffect(() => {
		dispatch(fetchComments(id));
		axios
			.get(`/posts/${id}`)
			.then((res) => {
				setData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.warn(err);
				alert("Error while getting post");
			});
	}, [commentData]);

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />;
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ""}
				user={data.user}
				createdAt={data.createdAt
					.substring(0, data.createdAt.lastIndexOf(".") - 3)
					.replace(/-/g, "/")
					.replace(/T/g, " ")}
				viewsCount={data.viewsCount}
				commentsCount={commentCount(data._id)}
				tags={data.tags}
				isFullPost>
				<ReactMarkdown children={data.text} />
			</Post>
			<CommentsBlock items={comments.items} isLoading={false} checkId={data._id} from={"FullPost"}>
				{window.localStorage.token && <AddComment id={data._id} addComment={commentReceiveData} />}
			</CommentsBlock>
		</>
	);
};
