import React, { useState, useEffect } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import styleCalender from "../styles/calender.module.scss"
import FullCalendar, { DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import RetryableAxios from '@/utils/RetryableAxios';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField
} from '@mui/material';

const CustomCalender: React.FC = () => {
	const [events, setEvents] = useState([]);
	const [newOpen, setNewOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [eventTitle, setEventTitle] = useState('');
	// const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [eventId, setEventId] = useState<string>("");

	/**
	 * 初期表示時に実行するプログラム
	 */
	useEffect(() => {
		const fetchInitialEvents = async () => {

			const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
			retryableAxios.request({
				url: '/api/calenderEvent',
				method: 'POST',
				data: { actionType: 'Read' }
			})
				.then(response => {
					const newEvents = [];
					if (response.data.message === "OK") {
						// 正常な動きをしたら
						let addEvent = null;
						response.data.result.map((header, idx) => {
							addEvent = {
								id: header.eventId,
								title: header.title,
								start: header.start,
								allDay: header.allDay,
								backgroundColor: 'lightblue',
								borderColor: 'blue',
								textColor: 'darkblue',
								extendedProps: {
									department: 'Finance'
								}
							};
							newEvents.push(addEvent);
						});
						setEvents(newEvents);
					}
				})
				.catch(error => console.error('Error:', error));

		};

		fetchInitialEvents();
	}, []); // 空の依存配列により、このuseEffectはマウント時に一度だけ実行されます

	/**
	 * ダイアログを閉じる処理
	 */
	const handleCommonDialogClose = () => {
		setNewOpen(false);
		setEditOpen(false);
		setEventTitle('');
		setSelectedDate('');
		setEventId('');
	};

	/**
	 * 新規ダイアログクローズ（保存）
	 */
	const handleNewDialogSave = () => {
		// const newEvent = {
		//   title: eventTitle,
		//   start: selectedDate.startStr,
		//   end: selectedDate.endStr,
		//   allDay: selectedDate.allDay
		// };
		const newEvent = {
			actionType: 'create',
			title: eventTitle,
			start: selectedDate,
			allDay: true
		};

		//登録
		const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: newEvent
		})
			.then(response => {
				if (response.data.message === "OK") {
					// 正常な動きをしたら
				}
			})
			.catch(error => console.error('Error:', error));

		//取得
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: { actionType: 'Read' }
		})
			.then(response => {
				if (response.data.message === "OK") {

					// 正常な動きをしたら
					const newEvents = [];
					let addEvent = null;
					response.data.result.map((header, idx) => {
						addEvent = {
							id: header.eventId,
							title: header.title,
							start: header.start,
							allDay: header.allDay,
							backgroundColor: 'lightblue',
							borderColor: 'blue',
							textColor: 'darkblue',
							extendedProps: {
								department: 'Finance'
							}
						};
						newEvents.push(addEvent);
					});
					setEvents(newEvents);

				}
			})
			.catch(error => console.error('Error:', error));

		handleCommonDialogClose();
	};

	/**
	 * 編集ダイアログクローズ（削除）
	 */
	const handleEditDialogDelete = () => {

		//削除
		const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: { actionType: 'delete', eventId: eventId }
		})
			.then(response => {
				if (response.data.message === "OK") {
					// 正常な動きをしたら

				}
			})
			.catch(error => console.error('Error:', error));

		//取得
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: { actionType: 'Read' }
		})
			.then(response => {
				if (response.data.message === "OK") {

					// 正常な動きをしたら
					const newEvents: object[] = [];
					let addEvent = null;
					response.data.result.map((header, idx) => {
						addEvent = {
							id: header.eventId,
							title: header.title,
							start: header.start,
							allDay: header.allDay,
							backgroundColor: 'lightblue',
							borderColor: 'blue',
							textColor: 'darkblue',
							extendedProps: {
								department: 'Finance'
							}
						};
						newEvents.push(addEvent);
					});
					setEvents(newEvents);

				}
			})
			.catch(error => console.error('Error:', error));

		handleCommonDialogClose();
	};

	/**
	 * 編集ダイアログクローズ（保存）
	 */
	const handleEditDialogSave = () => {

		const updateEvent = {
			actionType: 'update',
			eventId: eventId,
			title: eventTitle,
			start: selectedDate,
			allDay: true
		};

		//登録
		const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: updateEvent
		})
			.then(response => {
				if (response.data.message === "OK") {
					// 正常な動きをしたら
				}
			})
			.catch(error => console.error('Error:', error));

		//取得
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: { actionType: 'Read' }
		})
			.then(response => {
				if (response.data.message === "OK") {

					// 正常な動きをしたら
					const newEvents = [];
					let addEvent = null;
					response.data.result.map((header, idx) => {
						addEvent = {
							id: header.eventId,
							title: header.title,
							start: header.start,
							allDay: header.allDay,
							backgroundColor: 'lightblue',
							borderColor: 'blue',
							textColor: 'darkblue',
							extendedProps: {
								department: 'Finance'
							}
						};
						newEvents.push(addEvent);
					});
					setEvents(newEvents);

				}
			})
			.catch(error => console.error('Error:', error));

		handleCommonDialogClose();
	};

	/**
	 * 日付枠クリック
	 * @param selectInfo //日付データ
	 */
	const handleDateSelect = (selectInfo: DateSelectArg) => {
		// const title = prompt('Please enter a new title for your event');
		// const calendarApi = selectInfo.view.calendar;

		// calendarApi.unselect(); // clear date selection
		setSelectedDate(selectInfo.dateStr);
		setNewOpen(true);

		// if (title) {
		//   const newEvent = {
		//     id: String(new Date().getTime()), // Generate a unique ID
		//     title,
		//     date: selectInfo.dateStr ,
		//     allDay: selectInfo.allDay
		//   };
		//   setEvents([...events, newEvent]);
		//}
	};

	/**
	 * イベントクリック
	 * @param clickInfo //日付データ
	 */
	const handleEventClick = (clickInfo: EventClickArg) => {

		const retryableAxios = new RetryableAxios(3); // 最大3回リトライする

		//取得
		retryableAxios.request({
			url: '/api/calenderEvent',
			method: 'POST',
			data: { actionType: 'Read', eventId: clickInfo.event.id }
		})
			.then(response => {
				if (response.data.message === "OK") {
					setEventTitle(response.data.result[0].title);
					setSelectedDate(response.data.result[0].start.substr(0, 10));
					setEventId(response.data.result[0].eventId);
					setEditOpen(true);

				}
			})
			.catch(error => console.error('Error:', error));

	};

	return (
		<div className={styleCalender.calender}>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				dateClick={handleDateSelect}
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,dayGridWeek,dayGridDay'
				}}
				selectable={true}
				selectMirror={true}
				dayMaxEvents={true}
				weekends={true}
				//select={handleDateSelect}
				eventClick={handleEventClick}
			//eventsSet={handleEvents}
			/>

			{/* イベント登録ダイアログ */}
			<Dialog open={newOpen} onClose={handleCommonDialogClose}>
				<DialogTitle>予定を追加</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="予定"
						fullWidth
						value={eventTitle}
						onChange={(e) => setEventTitle(e.target.value)}
					/>

					<TextField
						id="date"
						label="日付"
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						InputLabelProps={{
							shrink: true,
						}} />

					<InputLabel id="payType-title">予定種別</InputLabel>
					<Select
						id="payType"
						label="予定種別"
						//value={payType}
						//onChange={}
					>
						<MenuItem value={'1'}>1日のみ</MenuItem>
						<MenuItem value={'2'}>毎週</MenuItem>
						<MenuItem value={'3'}>毎月</MenuItem>
					</Select>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleCommonDialogClose} color="secondary">
						キャンセル
					</Button>
					<Button onClick={handleNewDialogSave} color="primary">
						保存
					</Button>
				</DialogActions>
			</Dialog>

			{/* イベント編集ダイアログ */}
			<Dialog open={editOpen} onClose={handleCommonDialogClose}>
				<DialogTitle>予定を編集</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="予定"
						fullWidth
						value={eventTitle}
						onChange={(e) => setEventTitle(e.target.value)}
					/>

					<TextField
						id="date"
						label="日付"
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						InputLabelProps={{
							shrink: true,
						}} />

				</DialogContent>
				<DialogActions>
					<Button onClick={handleCommonDialogClose} color="secondary">
						キャンセル
					</Button>
					<Button onClick={handleEditDialogDelete} color="primary">
						削除
					</Button>
					<Button onClick={handleEditDialogSave} color="primary">
						変更
					</Button>
				</DialogActions>
			</Dialog>

		</div>
	);
};

export default CustomCalender;
