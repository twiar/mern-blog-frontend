import React from "react";

import { SideBlock } from "../SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

import styles from "./CommentsBlock.module.scss";

export const CommentsBlock = ({ items, children, isLoading = true, checkId, from }) => {
	return (
		<SideBlock title={from === "FullPost" ? "Комментарии" : "Последние комментарии"}>
			<List>
				{(isLoading ? [...Array(5)] : items)

					.filter((obj, index) =>
						from === "FullPost" ? obj.postId === checkId : index > items.length - 6,
					)
					.reverse()
					.map((obj) => (
						<React.Fragment key={obj.createdAt}>
							{from === "FullPost" ? (
								<ListItem alignItems="flex-start">
									<ListItemAvatar>
										{isLoading ? (
											<Skeleton variant="circular" width={40} height={40} />
										) : (
											<Avatar
												alt={obj.user.fullName}
												src={`${process.env.REACT_APP_API_URL}${obj.user.avatarUrl}`}
											/>
										)}
									</ListItemAvatar>
									{isLoading ? (
										<div style={{ display: "flex", flexDirection: "column" }}>
											<Skeleton variant="text" height={25} width={120} />
											<Skeleton variant="text" height={18} width={230} />
										</div>
									) : (
										<ListItemText primary={obj.user.fullName} secondary={obj.text} />
									)}
								</ListItem>
							) : (
								<Link to={`/posts/${obj.postId}`} className={styles.commentsBlock}>
									<ListItem alignItems="flex-start">
										<ListItemAvatar>
											{isLoading ? (
												<Skeleton variant="circular" width={40} height={40} />
											) : (
												<Avatar
													alt={obj.user.fullName}
													src={`${process.env.REACT_APP_API_URL}${obj.user.avatarUrl}`}
												/>
											)}
										</ListItemAvatar>
										{isLoading ? (
											<div style={{ display: "flex", flexDirection: "column" }}>
												<Skeleton variant="text" height={25} width={120} />
												<Skeleton variant="text" height={18} width={230} />
											</div>
										) : (
											<ListItemText primary={obj.user.fullName} secondary={obj.text} />
										)}
									</ListItem>
								</Link>
							)}
						</React.Fragment>
					))}
			</List>
			{children}
		</SideBlock>
	);
};
