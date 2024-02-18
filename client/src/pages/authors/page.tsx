import { FormEvent, useEffect, useState } from 'react';
import AppLayout from '../layouts/app.layout';
import { Link } from 'react-router-dom';
import Author from '../../models/author';
import { processAuthorSlug } from '../../utils/format.helper';
import axios from 'axios';
import Alert from '../../components/alert';

const AuthorsPage = () => {
	const [authors, setAuthors] = useState<Array<Author>>([]);
    const [editAuthor, setEditAuthor] = useState<Author|null>(null);
	const [tableAlert, setTableAlert] = useState(false);
	const [tableAlertVariant, setTableAlertVariant] = useState('success');
	const [tableAlertMessage, setTableAlertMessage] = useState('Success!');
	const [createFormVisibility, setCreateFormVisibility] = useState(false);
	const [createFormAlert, setCreateFormAlert] = useState(false);
    const [editFormVisibility, setEditFormVisibility] = useState(false);
    const [editFormAlert, setEditFormAlert] = useState(false);

	const getAuthors = async () => {
		await axios.get('/api/author/all').then((r) => {
			setAuthors(r.data);
		});
	};

	const handleTableAlertShow = () => setTableAlert(true);
	const handleTableAlertHide = () => setTableAlert(false);

	const handleCreateFormShow = () => setCreateFormVisibility(true);
	const handleCreateFormHide = () => setCreateFormVisibility(false);

	const handleCreateFormAlertShow = () => setCreateFormAlert(true);
	const handleCreateFormAlertHide = () => setCreateFormAlert(false);

	const handleEditFormShow = () => setEditFormVisibility(true);
	const handleEditFormHide = () => setEditFormVisibility(false);

	const handleEditFormAlertShow = () => setEditFormAlert(true);
	const handleEditFormAlertHide = () => setEditFormAlert(false);

	const handleAuthorCreate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputName = e.currentTarget.children[0] as HTMLInputElement;
		const inputSurname = e.currentTarget.children[1] as HTMLInputElement;

		const name = inputName.value;
		const surname = inputSurname.value;

		const regexName = new RegExp('^[a-zA-Z]{2,16}$');
		const regexSurname = new RegExp('^[a-zA-Z]{2,32}$');

		const isInputValid = regexName.test(name) && regexSurname.test(surname);

		if (isInputValid) {
			await axios
				.post('/api/author/create', {
					name: name,
					surname: surname,
				})
				.then((r) => {
                    const data = r.data;
                    setAuthors(authors.concat(data));
                    setTableAlertMessage('Author created successfully!');
                    handleTableAlertShow();
                })
				.catch((_) => {
                    setTableAlertMessage('Author could not be created..');
                    setTableAlertVariant('danger');
                    handleTableAlertShow();
                })
				.finally(() => {
                    handleCreateFormHide();
                });
		} else {
			handleCreateFormAlertShow();
		}

		inputName.value = '';
		inputSurname.value = '';
	};

	const prepareAuthorEdit = (e: any) => {
		const button = e.currentTarget as HTMLButtonElement;
		const authorId = button.value;
        const authorObj = authors.find(author => author._id === authorId);

        if (authorObj) {
		    setEditAuthor(authorObj);
            handleEditFormShow();
        }
	};

	const handleAuthorEdit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputName = e.currentTarget.children[0] as HTMLInputElement;
		const inputSurname = e.currentTarget.children[1] as HTMLInputElement;

		const name = inputName.value;
		const surname = inputSurname.value;

		const regexName = new RegExp('^[a-zA-Z]{2,16}$');
		const regexSurname = new RegExp('^[a-zA-Z]{2,32}$');

		const isInputValid = regexName.test(name) && regexSurname.test(surname);

		if (isInputValid && editAuthor) {
			await axios
				.post(`/api/author/update/${editAuthor._id}`, {
					name: name,
					surname: surname,
				})
				.then((r) => {
                    const data = r.data;
                    const authorIndex = authors.findIndex(author => author._id === editAuthor._id);
                    authors[authorIndex] = data;
                    setAuthors(authors);
                    setTableAlertMessage('Author updated successfully!');
                    setTableAlertVariant('success');
                    handleTableAlertShow();
                })
				.catch((_) => {
                    setTableAlertMessage('Author could not be updated..');
                    setTableAlertVariant('danger');
                    handleTableAlertShow();
                })
				.finally(() => {
                    handleEditFormHide();
                });
		} else {
			handleEditFormAlertShow();
		}

		inputName.value = '';
		inputSurname.value = '';
	};

	const handleAuthorDelete = async (e: any) => {
		const button = e.currentTarget as HTMLButtonElement;
		const authorId = button.value;
        const authorIndex = authors.findIndex(author => author._id === authorId);

        if (authorIndex > -1) {
			await axios
				.delete(`/api/author/delete/${authorId}`)
				.then((r) => {
                    if (r.status === 200) {
                        const updatedAuthors = authors.filter(author => author._id !== authorId);
                        setAuthors(updatedAuthors);
                        setTableAlertMessage('Author deleted successfully!');
                        setTableAlertVariant('success');
                        handleTableAlertShow();
                    }
                })
				.catch((_) => {
                    setTableAlertMessage('Author could not be deleted..');
                    setTableAlertVariant('danger');
                    handleTableAlertShow();
                });
        } else {
            setTableAlertMessage('Author could not be deleted..');
            setTableAlertVariant('danger');
            handleTableAlertShow();
        }
	};

	useEffect(() => {
		getAuthors();
	}, []);

	return (
		<AppLayout>
			{createFormVisibility && (
				<div className='fixed left-0 top-0 bg-black/50 w-full h-full flex justify-center items-center p-4'>
					<div className='flex flex-col bg-white w-full max-w-[320px] rounded shadow-lg px-8 py-4'>
						<h3 className='text-2xl font-semibold'>
							Create Author
						</h3>
						<hr className='my-8' />
						<Alert
							variant='danger'
							show={createFormAlert}
							hideHandler={handleCreateFormAlertHide}
						>
							Check input and try again!
						</Alert>
						<form
							id='form-author-create'
							className='flex flex-col justify-center items-center'
							onSubmit={handleAuthorCreate}
						>
							<input
								type='text'
								name='fac_name'
								placeholder='First name'
								minLength={2}
								maxLength={16}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<input
								type='text'
								name='fac_surname'
								placeholder='Last name'
								minLength={2}
								maxLength={32}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2'
								required
							/>
							<div className='flex justify-between items-center w-full mt-8'>
								<button
									type='submit'
									form='form-author-create'
									className='bg-slate-600 hover:bg-slate-500 transition duration-150 text-white rounded px-8 py-2 me-4'
								>
									Create
								</button>
								<button
									type='button'
									onClick={handleCreateFormHide}
									className='border border-red-600 hover:bg-red-600 text-red-600 hover:text-white transition duration-150 rounded px-8 py-1.5'
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>)}
			{editFormVisibility && editAuthor !== null && (
				<div className='fixed left-0 top-0 bg-black/50 w-full h-full flex justify-center items-center p-4'>
					<div className='flex flex-col bg-white w-full max-w-[320px] rounded shadow-lg px-8 py-4'>
						<h3 className='text-2xl font-semibold'>
							Edit Author:
                            <br/>
                            {`${editAuthor.name.charAt(0)}. ${editAuthor.surname}`}
						</h3>
						<hr className='my-8' />
						<Alert
							variant='danger'
							show={editFormAlert}
							hideHandler={handleEditFormAlertHide}
						>
							Check input and try again!
						</Alert>
						<form
							id='form-author-edit'
							className='flex flex-col justify-center items-center'
							onSubmit={handleAuthorEdit}
						>
							<input
								type='text'
								name='fae_name'
								placeholder='First name'
                                defaultValue={editAuthor.name}
								minLength={2}
								maxLength={16}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<input
								type='text'
								name='fae_surname'
								placeholder='Last name'
                                defaultValue={editAuthor.surname}
								minLength={2}
								maxLength={32}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2'
								required
							/>
							<div className='flex justify-between items-center w-full mt-8'>
								<button
									type='submit'
									form='form-author-edit'
									className='bg-slate-600 hover:bg-slate-500 transition duration-150 text-white rounded px-8 py-2 me-4'
								>
									Update
								</button>
								<button
									type='button'
									onClick={handleEditFormHide}
									className='border border-red-600 hover:bg-red-600 text-red-600 hover:text-white transition duration-150 rounded px-8 py-1.5'
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>)}
			<div className='container mx-auto px-4'>
				<h2 className='font-bold text-3xl text-slate-700 mb-2'>
					Authors
				</h2>
				<p className='text-slate-500'>
					On this page, you can add / edit / delete authors.
				</p>
				<hr className='my-8' />
				<div className='flex justify-start items-center mb-8'>
					<button
						onClick={handleCreateFormShow}
						className='flex justify-center items-center bg-slate-600 hover:bg-slate-500 transition duration-150 text-white rounded px-4 py-2'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={2}
							stroke='currentColor'
							className='w-5 h-5'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
							/>
						</svg>
						<span className='font-semibold text-sm ms-2'>
							Add Author
						</span>
					</button>
				</div>
				<Alert
					variant={tableAlertVariant}
					show={tableAlert}
					hideHandler={handleTableAlertHide}
				>
					{tableAlertMessage}
				</Alert>
				<div className='flex justify-center items-center rounded border border border-slate-600/25 p-2'>
					{authors.length > 0 && (
						<table className='table-auto w-full'>
							<thead>
								<tr className='border-b-2'>
									<th className='text-start text-slate-700 p-2'>
										Name
									</th>
									<th className='text-start text-slate-700 p-2'>
										Surname
									</th>
									<th className='text-start text-slate-700 p-2'></th>
								</tr>
							</thead>
							<tbody>
								{authors.map((author, i) => {
									const border = i !== 0 ? 'border-t' : '';

									return (
										<tr
											key={i}
											className={`${border} hover:bg-slate-200/15 transition duration-150`}
										>
											<td className='text-start text-slate-600 p-2'>
												{author.name}
											</td>
											<td className='text-start text-slate-600 p-2'>
												{author.surname}
											</td>
											<td className='text-start text-slate-600 p-2'>
												<div className='flex justify-center items-center flex-wrap'>
													<Link
														to={`/books/${processAuthorSlug(
															author
														)}`}
														className='font-semibold text-sky-500 hover:text-sky-300 transition duration-150 m-1 p-1'
													>
														Books
													</Link>
													<button
														onClick={prepareAuthorEdit}
														value={author._id}
														className='font-semibold text-slate-500 hover:text-slate-300 transition duration-150 m-1 p-1'
													>
														Edit
													</button>
													<button
														onClick={handleAuthorDelete}
														value={author._id}
														className='font-semibold text-red-500 hover:text-red-300 transition duration-150 m-1 p-1'
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
					{authors.length < 1 && (
						<div className='flex flex-col justify-center items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='text-slate-200 mb-2 w-16 h-16'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
								/>
							</svg>
							<p className='text-slate-500 text-sm font-semibold'>
								No data to display
							</p>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
};

export default AuthorsPage;
