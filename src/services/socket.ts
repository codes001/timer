// // import { io } from 'socket.io-client';
// // import { useRoomStore } from '../store/userRoomStore';

// // // const socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000');
// // const socket = io('http://localhost:3000');

// // export const initSocket = (roomId: string) => {
// //   socket.emit('join-room', roomId);

// //   socket.on('room-update', (updatedState) => {
// //     useRoomStore.getState().updateRoom(updatedState);
// //   });
// // };

// // export const emitAction = (action: string, payload: any) => {
// //   socket.emit('action', { action, payload });
// // };


// import { useEffect } from 'react';
// import { supabase } from '../services/supabase';
// import { useTimerStore } from '../store/userTimerStore'; // Use your actual store file path

// export const useSyncEngine = (roomId: string) => {
//   const syncFromRemote = useTimerStore((state) => state.syncFromRemote);

//   useEffect(() => {
//     // This creates a "Virtual Room" in Supabase without needing a Node.js server
//     const channel = supabase.channel(roomId, {
//       config: { broadcast: { self: true } },
//     });

//     channel
//       .on('broadcast', { event: 'sync' }, ({ payload }) => {
//         console.log("Received Sync:", payload);
//         syncFromRemote(payload);
//       })
//       .subscribe((status) => {
//         console.log(`Connection to ${roomId}: ${status}`);
//       });

//     return () => { supabase.removeChannel(channel); };
//   }, [roomId, syncFromRemote]);

//   const broadcast = (payload: any) => {
//     supabase.channel(roomId).send({
//       type: 'broadcast',
//       event: 'sync',
//       payload,
//     });
//   };

//   return { broadcast };
// };

