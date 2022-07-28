import { Box, Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import images from "../../constants/images";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { CommentsBlock } from "../CommentsBlock";
import { TagsBlock } from "../TagsBlock";
import styles from "./MobileMenu.module.scss";

export const MobileMenu = (props) => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const { comments } = useSelector((state) => state.comments);
	const { tags } = useSelector((state) => state.posts);
	const isTagsLoading = tags.status === "loading";
	const location = useLocation();

	const onClickLogout = () => {
		if (window.confirm("Вы действительно хотите выйти?")) {
			dispatch(logout());
			window.localStorage.removeItem("token");
			window.localStorage.removeItem("avatarUrl");
			window.localStorage.removeItem("fullName");
		}
	};

	useEffect(() => {
		props.ifClose(false);
	}, [location.pathname]);

	const closeMenu = () => {
		props.ifClose(false);
	};

	return (
		<Grid item className={props.ifOpen ? `${styles.root} ${styles.activeRoot}` : `${styles.root}`}>
			<div className={styles.inner}>
				<Box className={styles.buttons}>
					<Button
						variant="contained"
						className={`${styles.button} ${styles.close}`}
						onClick={closeMenu}>
						<img src={images.close} alt="close" />
					</Button>
					{isAuth ? (
						<>
							<div className={`${styles.button} ${styles.avatar}`}>
								<div>
									<img
										src={`${process.env.REACT_APP_API_URL}${window.localStorage.avatarUrl}`}
										alt="avatar"
									/>
								</div>
								{window.localStorage.fullName}
								<Button
									onClick={onClickLogout}
									variant="contained"
									color="error"
									className={`${styles.button} ${styles.logout}`}>
									<img src={images.logout} alt="logout" />
								</Button>
							</div>
							<Link to="/add-post">
								<Button variant="contained" className={`${styles.button} ${styles.add}`}>
									<img src={images.add} alt="add post" />
									Написать статью
								</Button>
							</Link>
						</>
					) : (
						<>
							<Link to="/login">
								<Button variant="outlined" className={`${styles.button}`}>
									<img src={images.login} alt="login" />
									Войти
								</Button>
							</Link>
							<Link to="/register">
								<Button variant="contained" className={`${styles.button}`}>
									<img src={images.register} alt="register" />
									Создать аккаунт
								</Button>
							</Link>
						</>
					)}
				</Box>
			</div>
			<TagsBlock items={tags.items} isLoading={isTagsLoading} className={`${styles.root}`} />
			<CommentsBlock items={comments.items} isLoading={false} from={"Home"} />
		</Grid>
	);
};
