// // import { useState, useEffect } from 'react';
// // import { Timer } from '../../types/timer';

// // export const useTimerEngine = (timer: Timer | undefined) => {
// //   const [timeLeft, setTimeLeft] = useState(timer?.duration || 0);

// //   useEffect(() => {
// //     if (!timer || timer.status !== 'RUNNING' || !timer.endTime) {
// //       if (timer) setTimeLeft(timer.duration);
// //       return;
// //     }

// //     const tick = () => {
// //       const now = Date.now();
// //       const remaining = Math.max(0, Math.floor((timer.endTime! - now) / 1000));
// //       setTimeLeft(remaining);
      
// //       if (remaining === 0) clearInterval(interval);
// //     };

// //     const interval = setInterval(tick, 100); // 100ms for smooth UI
// //     return () => clearInterval(interval);
// //   }, [timer]);

// //   return timeLeft;
// // };



// import { useState, useEffect } from 'react';
// import { TimerState } from '../../store/userRoomStore';

// export const useTimerEngine = (timer: TimerState) => {
//   const [timeLeft, setTimeLeft] = useState(timer.duration);

//   useEffect(() => {
//     if (timer.status !== 'RUNNING' || !timer.endTime) {
//       setTimeLeft(timer.duration);
//       return;
//     }

//     const tick = () => {
//       const remaining = Math.max(0, Math.floor((timer.endTime! - Date.now()) / 1000));
//       setTimeLeft(remaining);
//       if (remaining === 0) clearInterval(interval);
//     };

//     const interval = setInterval(tick, 100);
//     return () => clearInterval(interval);
//   }, [timer]);

//   return timeLeft;
// };

