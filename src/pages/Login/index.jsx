import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: "test@test.ru",
			password: "123",
		},
		mode: "onChange",
	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));

		if (!data.payload) {
			return alert("Failed to login!");
		}

		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
			window.localStorage.setItem("avatarUrl", data.payload.avatarUrl);
			window.localStorage.setItem("fullName", data.payload.fullName);
		}
	};

	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Log in
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="email"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register("email", { required: "Enter your email" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Password"
					type="password"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register("password", { required: "Enter password" })}
					fullWidth
				/>
				<Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
					Log in
				</Button>
			</form>
		</Paper>
	);
};
