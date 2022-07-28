import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import axios from "../../axios";

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);

	const [avatarUrl, setAvatarUrl] = React.useState("");
	const [avatarData, setAvatarData] = React.useState(null);
	const inputAvatarRef = React.useRef(null);

	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setValue,
	} = useForm({
		defaultValues: {
			avatarUrl: "/uploads/avatar.jpg",
			fullName: "",
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const onClickRemoveImage = async () => {
		setAvatarUrl("");
	};

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values));

		if (!data.payload) {
			return alert("Failed to register!");
		} else {
			await axios.post("/uploadavatar", avatarData);
		}

		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
			window.localStorage.setItem("avatarUrl", data.payload.avatarUrl);
			window.localStorage.setItem("fullName", data.payload.fullName);
		}
	};

	const handleChangeAvatar = (event) => {
		let file = event.target.files[0];
		if (file) {
			let fSize = file.size;

			let fileCheckSize = Math.round(fSize / 1024);
			if (fileCheckSize >= 2048) {
				alert("Image size exceeds 2MB");
			} else {
				setAvatarUrl(URL.createObjectURL(file));

				let fileFormat = file.name.substring(file.name.lastIndexOf("."), file.name.length);
				document.getElementById("avatarUrl").value = `/uploads/${file.lastModified}${fileFormat}`;

				const formData = new FormData();
				formData.append("image", file, `${file.lastModified}${fileFormat}`);
				setAvatarData(formData);
			}
		}
	};

	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Create an account
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					readOnly
					id="avatarUrl"
					{...register("avatarUrl", { required: false })}
					name="avatarUrl"
					style={{ display: "none" }}
				/>
				<div className={styles.avatar}>
					{!avatarUrl && (
						<div className={styles.avatarBox}>
							<Button
								classes={{ root: styles.addAvatar }}
								variant="contained"
								color="error"
								onClick={() => inputAvatarRef.current.click()}>
								＋
							</Button>
							<Avatar
								sx={{ width: 100, height: 100 }}
								src={`${process.env.REACT_APP_API_URL}/uploads/avatar.jpg`}
							/>
						</div>
					)}
					<input
						ref={inputAvatarRef}
						accept="image/*"
						type="file"
						onChange={handleChangeAvatar}
						hidden
					/>

					{avatarUrl && (
						<div className={styles.avatarBox}>
							<Button
								classes={{ root: styles.removeAvatar }}
								variant="contained"
								color="error"
								onClick={onClickRemoveImage}>
								✖
							</Button>
							<Avatar sx={{ width: 100, height: 100 }} src={avatarUrl} />
						</div>
					)}
				</div>
				<TextField
					className={styles.field}
					label="Full name"
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register("fullName", { required: "Enter your name" })}
					fullWidth
				/>
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
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					onClick={() => {
						setValue("avatarUrl", `${document.getElementById("avatarUrl").value}`);
					}}
					fullWidth>
					Create an account
				</Button>
			</form>
		</Paper>
	);
};
