import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";

import images from "../../constants/images";
import { Box } from "@mui/material";
import { MobileMenu } from "../MobileMenu";

export const Header = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const [toggleMenu, setToggleMenu] = useState(false);

	function refreshPage() {
		window.location.reload(false);
	}

	if (!window.localStorage.avatarUrl && isAuth) {
		refreshPage();
	}

	const onClickLogout = () => {
		if (window.confirm("Do you really want to leave?")) {
			dispatch(logout());
			window.localStorage.removeItem("token");
			window.localStorage.removeItem("avatarUrl");
			window.localStorage.removeItem("fullName");
		}
	};

	const callback = (bool) => {
		setToggleMenu(bool);
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<img src={images.logo} alt="REACT BLOG" />
					</Link>
					<Box className={styles.buttons} display={{ xs: "none", md: "inherit" }}>
						{isAuth ? (
							<>
								<Link to="/add-post">
									<Button variant="contained" className={`${styles.button} ${styles.add}`}>
										<img src={images.add} alt="add post" />
										Create post
									</Button>
								</Link>
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
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined" className={`${styles.button}`}>
										<img src={images.login} alt="login" />
										Login
									</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained" className={`${styles.button}`}>
										<img src={images.register} alt="register" />
										Create an account
									</Button>
								</Link>
							</>
						)}
					</Box>
					<Box className={styles.buttons} display={{ xs: "block", md: "none" }}>
						<Button
							variant="contained"
							color="error"
							className={`${styles.button} ${styles.menu}`}
							onClick={() => callback(true)}>
							<img src={images.menu} alt="menu" />
						</Button>
					</Box>
				</div>
			</Container>
			<MobileMenu ifClose={callback} ifOpen={toggleMenu} />
		</div>
	);
};
