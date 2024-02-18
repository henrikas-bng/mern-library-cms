import { FormEvent, useEffect, useState } from 'react';
import AppLayout from '../layouts/app.layout';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthorIdFromSlug, processAuthorSlug } from '../../utils/format.helper';
import axios from 'axios';
import Alert from '../../components/alert';
import Book from '../../models/book';
import Author from '../../models/author';

const BooksPage = () => {
	const navigate = useNavigate();
	const params = useParams();

	const [books, setBooks] = useState<Array<Book>>([]);
	const [authors, setAuthors] = useState<Array<Author>>([]);
	const [viewBook, setViewBook] = useState<Book | null>(null);
	const [editBook, setEditBook] = useState<Book | null>(null);
	const [tableAlert, setTableAlert] = useState(false);
	const [tableAlertVariant, setTableAlertVariant] = useState('success');
	const [tableAlertMessage, setTableAlertMessage] = useState('Success!');
	const [createFormVisibility, setCreateFormVisibility] = useState(false);
	const [createFormAlert, setCreateFormAlert] = useState(false);
	const [viewBookPanel, setViewBookPanel] = useState(false);
	const [editFormVisibility, setEditFormVisibility] = useState(false);
	const [editFormAlert, setEditFormAlert] = useState(false);
	const [filterByAuthorId] = useState<string|null>(getAuthorIdFromSlug(params.authorSlug));

	const getBooks = async () => {
		if (filterByAuthorId) {
			await axios.get(`/api/book/all/${filterByAuthorId}`).then((r) => {
				setBooks(r.data);
			});
		} else {			
			await axios.get('/api/book/all').then((r) => {
				setBooks(r.data);
			});
		}
	};

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

	const handleBookViewShow = () => setViewBookPanel(true);
	const handleBookViewHide = () => setViewBookPanel(false);

	const handleEditFormShow = () => setEditFormVisibility(true);
	const handleEditFormHide = () => setEditFormVisibility(false);

	const handleEditFormAlertShow = () => setEditFormAlert(true);
	const handleEditFormAlertHide = () => setEditFormAlert(false);

	const handleBookFilter = () => {
		const filterSelect = document.getElementById('select_book_filter') as HTMLSelectElement;
		const filterValue = filterSelect.value;

		if (filterValue === 'reset') {
			navigate('/books');
			navigate(0);
			return;
		}

		const author = authors.find(author => author._id === filterValue);

		if (author) {
			const filterSlug = processAuthorSlug(author);
			navigate(`/books/${filterSlug}`);
			navigate(0);
		}
	};

	const getViewBookAuthorFullName = () => {
		if (viewBook) {
			const author = authors.find(author => author._id === viewBook.authorId);
			
			if (author)
				return `${author.name} ${author.surname}`;
		}

		return '';
	};

	const handleBookCreate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputAuthor = e.currentTarget.children[0] as HTMLSelectElement;
		const inputTitle = e.currentTarget.children[1] as HTMLInputElement;
		const inputDescription = e.currentTarget
			.children[2] as HTMLTextAreaElement;
		const inputPages = e.currentTarget.children[3] as HTMLInputElement;
		const inputIsbn = e.currentTarget.children[4] as HTMLInputElement;

		const authorId = inputAuthor.value;
		const title = inputTitle.value;
		const description = inputDescription.value;
		const pages = Number(inputPages.value.trim());
		const isbn = inputIsbn.value;

		const checkAuthor = authorId !== '0';
		const checkTitle = title.length > 0 && title.length <= 128;
		const checkDescription =
			description.length > 0 && description.length <= 500;
		const checkPages = pages > 0 && pages <= 9999;
		const regexIsbn = new RegExp('^[0-9]{10}$');

		const isInputValid =
			checkAuthor &&
			checkTitle &&
			checkDescription &&
			checkPages &&
			regexIsbn.test(isbn);

		if (isInputValid) {
			await axios
				.post('/api/book/create', {
					authorId: authorId,
					title: title,
					description: description,
					pages: pages,
					isbn: isbn,
				})
				.then((r) => {
					const data = r.data;
					setBooks(books.concat(data));
					setTableAlertMessage('Book created successfully!');
					setTableAlertVariant('success');
					handleTableAlertShow();
				})
				.catch((_) => {
					setTableAlertMessage('Book could not be created..');
					setTableAlertVariant('danger');
					handleTableAlertShow();
				})
				.finally(() => {
					handleCreateFormHide();
				});
		} else {
			handleCreateFormAlertShow();
		}

		inputAuthor.value = '0';
		inputTitle.value = '';
		inputDescription.value = '';
		inputPages.value = '0';
		inputIsbn.value = '';
	};

	const handleBookView = (e: any) => {
		const button = e.currentTarget as HTMLButtonElement;
		const bookId = button.value;
		const bookObj = books.find((book) => book._id === bookId);

		if (bookObj) {
			setViewBook(bookObj);
			handleBookViewShow();
		}
	};

	const prepareBookEdit = (e: any) => {
		const button = e.currentTarget as HTMLButtonElement;
		const bookId = button.value;
		const bookObj = books.find((book) => book._id === bookId);

		if (bookObj) {
			setEditBook(bookObj);
			handleEditFormShow();
		}
	};

	const handleBookEdit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputAuthor = e.currentTarget.children[0] as HTMLSelectElement;
		const inputTitle = e.currentTarget.children[1] as HTMLInputElement;
		const inputDescription = e.currentTarget
			.children[2] as HTMLTextAreaElement;
		const inputPages = e.currentTarget.children[3] as HTMLInputElement;
		const inputIsbn = e.currentTarget.children[4] as HTMLInputElement;

		const authorId = inputAuthor.value;
		const title = inputTitle.value;
		const description = inputDescription.value;
		const pages = Number(inputPages.value.trim());
		const isbn = inputIsbn.value;

		const checkAuthor = authorId !== '0';
		const checkTitle = title.length > 0 && title.length <= 128;
		const checkDescription =
			description.length > 0 && description.length <= 500;
		const checkPages = pages > 0 && pages <= 9999;
		const regexIsbn = new RegExp('^[0-9]{10}$');

		const isInputValid =
			checkAuthor &&
			checkTitle &&
			checkDescription &&
			checkPages &&
			regexIsbn.test(isbn);

		if (isInputValid && editBook) {
			await axios
				.post(`/api/book/update/${editBook._id}`, {
					authorId: authorId,
					title: title,
					description: description,
					pages: pages,
					isbn: isbn,
				})
				.then((r) => {
					const data = r.data;
					const bookIndex = books.findIndex(
						(book) => book._id === editBook._id
					);
					books[bookIndex] = data;
					setBooks(books);
					setTableAlertMessage('Book updated successfully!');
					setTableAlertVariant('success');
					handleTableAlertShow();
				})
				.catch((_) => {
					setTableAlertMessage('Book could not be updated..');
					setTableAlertVariant('danger');
					handleTableAlertShow();
				})
				.finally(() => {
					handleEditFormHide();
				});
		} else {
			handleEditFormAlertShow();
		}

		inputAuthor.value = '0';
		inputTitle.value = '';
		inputDescription.value = '';
		inputPages.value = '0';
		inputIsbn.value = '';
	};

	const handleBookDelete = async (e: any) => {
		const button = e.currentTarget as HTMLButtonElement;
		const bookId = button.value;
		const bookIndex = books.findIndex((book) => book._id === bookId);

		if (bookIndex > -1) {
			await axios
				.delete(`/api/book/delete/${bookId}`)
				.then((r) => {
					if (r.status === 200) {
						const updatedBooks = books.filter(
							(book) => book._id !== bookId
						);
						setBooks(updatedBooks);
						setTableAlertMessage('Book deleted successfully!');
						setTableAlertVariant('success');
						handleTableAlertShow();
					}
				})
				.catch((_) => {
					setTableAlertMessage('Book could not be deleted..');
					setTableAlertVariant('danger');
					handleTableAlertShow();
				});
		} else {
			setTableAlertMessage('Book could not be deleted..');
			setTableAlertVariant('danger');
			handleTableAlertShow();
		}
	};

	useEffect(() => {
		getBooks();
		getAuthors();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AppLayout>
			{viewBookPanel && viewBook && (
				<div className='fixed left-0 top-0 bg-black/50 w-full h-full flex justify-center items-center p-4'>
					<div className='flex flex-col bg-white w-full max-w-[512px] rounded shadow-lg px-8 py-4'>
						<div className='flex justify-between items-center'>
							<h4 className='text-lg font-semibold'>{viewBook.title}</h4>
							<button onClick={handleBookViewHide} className='hover:text-slate-500 transition duration-150 ms-4 p-4'>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<hr className='my-4' />
						<div className='flex flex-col mb-8'>
							<span className='text-xs text-slate-400 mb-2'>Description</span>
							<p>
								{viewBook.description}
							</p>
						</div>
						<div className='flex justify-between items-start flex-wrap mb-8'>							
							<div className='flex flex-col mb-4 me-4'>
								<span className='text-xs text-slate-400 mb-2'>Pages</span>
								<p>
									{viewBook.pages}
								</p>
							</div>
							<div className='flex flex-col mb-4'>
								<span className='text-xs text-slate-400 mb-2'>ISBN</span>
								<p>
									{viewBook.isbn}
								</p>
							</div>
						</div>
						<div className='flex flex-col mb-8'>
							<span className='text-xs text-slate-400 mb-2'>By</span>
							<p>
								{getViewBookAuthorFullName()}
							</p>
						</div>
					</div>
				</div>
			)}
			{createFormVisibility && (
				<div className='fixed left-0 top-0 bg-black/50 w-full h-full flex justify-center items-center p-4'>
					<div className='flex flex-col bg-white w-full max-w-[320px] rounded shadow-lg px-8 py-4'>
						<h3 className='text-2xl font-semibold'>Create Book</h3>
						<hr className='my-8' />
						<Alert
							variant='danger'
							show={createFormAlert}
							hideHandler={handleCreateFormAlertHide}
						>
							Check input and try again!
						</Alert>
						<form
							id='form-book-create'
							className='flex flex-col justify-center items-center'
							onSubmit={handleBookCreate}
						>
							<select
								defaultValue={0}
								name='fbc_author'
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							>
								<option value={0} disabled>
									Select Author:
								</option>
								{authors.map((author, i) => {
									return (
										<option key={i} value={author._id}>
											{`${author.name} ${author.surname}`}
										</option>
									);
								})}
							</select>
							<input
								type='text'
								name='fbc_title'
								placeholder='Book title'
								minLength={1}
								maxLength={128}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<textarea
								name='fbc_description'
								placeholder='Description'
								minLength={1}
								maxLength={500}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							></textarea>
							<input
								type='number'
								name='fbc_pages'
								placeholder='Number of pages'
								min={1}
								max={9999}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<input
								type='text'
								name='fbc_isbn'
								placeholder='ISBN number'
								minLength={10}
								maxLength={10}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2'
								required
							/>
							<div className='flex justify-between items-center w-full mt-8'>
								<button
									type='submit'
									form='form-book-create'
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
				</div>
			)}
			{editFormVisibility && editBook !== null && (
				<div className='fixed left-0 top-0 bg-black/50 w-full h-full flex justify-center items-center p-4'>
					<div className='flex flex-col bg-white w-full max-w-[320px] rounded shadow-lg px-8 py-4'>
						<h3 className='text-2xl font-semibold'>
							Edit Book:
							<br />
							{editBook.title}
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
							id='form-book-edit'
							className='flex flex-col justify-center items-center'
							onSubmit={handleBookEdit}
						>
							<select
								defaultValue={editBook._id}
								name='fbe_author'
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							>
								<option value={0} disabled>
									Select Author:
								</option>
								{authors.map((author, i) => {
									return (
										<option key={i} value={author._id}>
											{`${author.name} ${author.surname}`}
										</option>
									);
								})}
							</select>
							<input
								type='text'
								name='fbe_title'
								placeholder='Book title'
								defaultValue={editBook.title}
								minLength={1}
								maxLength={128}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<textarea
								name='fbe_description'
								placeholder='Description'
								defaultValue={editBook.description}
								minLength={1}
								maxLength={500}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							></textarea>
							<input
								type='number'
								name='fbe_pages'
								placeholder='Number of pages'
								defaultValue={editBook.pages}
								min={1}
								max={9999}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
								required
							/>
							<input
								type='text'
								name='fbe_isbn'
								placeholder='ISBN number'
								defaultValue={editBook.isbn}
								minLength={10}
								maxLength={10}
								className='w-full ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2'
								required
							/>
							<div className='flex justify-between items-center w-full mt-8'>
								<button
									type='submit'
									form='form-book-edit'
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
				</div>
			)}
			<div className='container mx-auto px-4'>
				<h2 className='font-bold text-3xl text-slate-700 mb-2'>
					Books
				</h2>
				<p className='text-slate-500'>
					On this page, you can add / edit / delete books, or filter
					by author.
				</p>
				<hr className='my-8' />
				<div className='flex justify-between items-center mb-8'>
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
							Add Book
						</span>
					</button>
					<div className='flex justify-center items-center'>
						<select
							id='select_book_filter'
							name='book_filter'
							defaultValue={0}
							className='me-2 ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2'
							
						>
							<option value={0} disabled>Filter by Author:</option>
							{authors.map((author, i) => {
								return (
									<option key={i} value={author._id} selected={(author._id === filterByAuthorId)}>
										{`${author.name} ${author.surname}`}
									</option>
								);
							})}
							<option value='reset'>Reset filter</option>
						</select>
						<button
							onClick={handleBookFilter}
							className='bg-slate-600 hover:bg-slate-500 transition duration-150 text-white rounded px-4 py-2'
						>
							Filter
						</button>
					</div>
				</div>
				<Alert
					variant={tableAlertVariant}
					show={tableAlert}
					hideHandler={handleTableAlertHide}
				>
					{tableAlertMessage}
				</Alert>
				<div className='flex justify-center items-center rounded border border border-slate-600/25 p-2'>
					{books.length > 0 && (
						<table className='table-auto w-full'>
							<thead>
								<tr className='border-b-2'>
									<th className='text-start text-slate-700 p-2'>
										Title
									</th>
									<th className='text-start text-slate-700 p-2'>
										Description
									</th>
									<th className='text-start text-slate-700 p-2'>
										Pages
									</th>
									<th className='text-start text-slate-700 p-2'>
										ISBN
									</th>
									<th className='text-start text-slate-700 p-2'></th>
								</tr>
							</thead>
							<tbody>
								{books.map((book, i) => {
									const border = i !== 0 ? 'border-t' : '';

									return (
										<tr
											key={i}
											className={`${border} hover:bg-slate-200/15 transition duration-150`}
										>
											<td className='text-start text-slate-600 p-2'>
												{book.title}
											</td>
											<td className='text-start text-slate-600 p-2'>
												<p className='truncate max-w-[128px]'>
													{book.description}
												</p>
											</td>
											<td className='text-start text-slate-600 p-2'>
												{book.pages}
											</td>
											<td className='text-start text-slate-600 p-2'>
												{book.isbn}
											</td>
											<td className='text-start text-slate-600 p-2'>
												<div className='flex justify-center items-center flex-wrap'>
													<button
														onClick={handleBookView}
														value={book._id}
														className='font-semibold text-sky-500 hover:text-sky-300 transition duration-150 m-1 p-1'
													>
														View
													</button>
													<button
														onClick={
															prepareBookEdit
														}
														value={book._id}
														className='font-semibold text-slate-500 hover:text-slate-300 transition duration-150 m-1 p-1'
													>
														Edit
													</button>
													<button
														onClick={
															handleBookDelete
														}
														value={book._id}
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
					{books.length < 1 && (
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

export default BooksPage;
