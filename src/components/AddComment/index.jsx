import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import axios from "../../axios";

export const AddComment = (props) => {
	const [message, setMessage] = React.useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			user: {
				avatarUrl: window.localStorage.avatarUrl,
				fullName: window.localStorage.fullName,
			},
			text: "",
			postId: props.id,
		},
		mode: "onChange",
	});

	const handleChange = (event) => {
		setMessage(event.target.value);
	};

	const onSubmit = async (values) => {
		try {
			await axios.post(`/posts/${props.id}/comments`, values);
			props.addComment(values);
			setMessage("");
		} catch (err) {
			console.warn(err);
			alert("Ошибка при создании комментария!");
		}
	};

	return (
		<>
			<form className={styles.root} onSubmit={handleSubmit(onSubmit)}>
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
						error={Boolean(errors.text?.message)}
						helperText={errors.text?.message}
						value={message}
						{...register("text")}
						onChange={handleChange}
					/>
					<Button disabled={!isValid} type="submit" size="large" variant="contained">
						Отправить
					</Button>
				</div>
			</form>
		</>
	);
};
