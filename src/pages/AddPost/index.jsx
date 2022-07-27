import React from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import { selectIsAuth } from "../../redux/slices/auth";
import styles from "./AddPost.module.scss";

import axios from "../../axios";

import { useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { fetchRemoveImage } from "../../redux/slices/images";

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState("");
	const [imageBlob, setImageBlob] = React.useState("");
	const [imageUrl, setImageUrl] = React.useState("");
	const [deleteImageUrl, setDeleteImageUrl] = React.useState("");
	const [imageData, setImageData] = React.useState(null);
	const inputFileRef = React.useRef(null);

	const isEditing = Boolean(id);
	const dispatch = useDispatch();

	const handleChangeFile = (event) => {
		const file = event.target.files[0];
		console.log(file);
		if (file) {
			let fSize = file.size;

			let fileCheckSize = Math.round(fSize / 1024);
			if (fileCheckSize >= 4096) {
				alert("Размер картинки превышает 4MB");
			} else {
				setImageBlob(URL.createObjectURL(file));
				setImageUrl(`/uploads/${file.name}`);
				const formData = new FormData();
				formData.append("image", file);
				setImageData(formData);
			}
		}
	};

	const onClickRemoveImageUrl = () => {
		if (isEditing) {
			setDeleteImageUrl(imageUrl);
		}
		setImageUrl("");
	};

	const onClickRemoveImageBlob = () => {
		setImageBlob("");
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);
			const fields = {
				title,
				imageUrl,
				tags,
				text,
			};
			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post("/posts", fields);

			if (!isEditing) {
				await axios.post("/upload", imageData);
			} else {
				if (deleteImageUrl && deleteImageUrl !== imageUrl) {
					dispatch(fetchRemoveImage(deleteImageUrl.split("/")[2]));
					await axios.post("/upload", imageData);
				}
			}

			const _id = isEditing ? id : data._id;

			navigate(`/posts/${_id}`);
		} catch (err) {
			console.warn(err);
			alert("Ошибка при создании статьи!");
		}
	};

	React.useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(","));
				})
				.catch((err) => {
					console.warn(err);
					alert("Ошибка при получении статьи!");
				});
		}
	}, []);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem("token") && !isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Загрузить превью
			</Button>
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
			{imageBlob && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImageBlob}>
						Удалить
					</Button>
					<img className={styles.image} src={imageBlob} alt="Uploaded" />
				</>
			)}

			{!imageBlob && imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImageUrl}>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				fullWidth
			/>
			<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? "Сохранить" : "Опубликовать"}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
