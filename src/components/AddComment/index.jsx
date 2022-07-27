import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const AddComment = () => {
	return (
		<>
			<div className={styles.root}>
				<Avatar
					classes={{ root: styles.avatar }}
					src={`${process.env.REACT_APP_API_URL}${window.localStorage.avatarUrl}`}
				/>
				<div className={styles.form}>
					<TextField
						label="Написать комментарий"
						variant="outlined"
						maxRows={10}
						multiline
						fullWidth
					/>
					<Button variant="contained">Отправить</Button>
				</div>
			</div>
		</>
	);
};
