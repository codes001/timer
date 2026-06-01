// import { useEffect } from 'react';
// import { getRoomChannel } from '../../services/supabase';
// import { useRoomStore } from '../../store/userRoomStore';

// export const useTimerSync = (roomId: string) => {
//   const { updateRoom } = useRoomStore();

//   useEffect(() => {
//     const channel = getRoomChannel(roomId);

//     channel
//       .on('broadcast', { event: 'timer_update' }, ({ payload }) => {
//         updateRoom(payload); // Update local store when remote change occurs
//       })
//       .subscribe();

//     return () => { channel.unsubscribe(); };
//   }, [roomId, updateRoom]);

//   const broadcastUpdate = (newState: any) => {
//     getRoomChannel(roomId).send({
//       type: 'broadcast',
//       event: 'timer_update',
//       payload: newState
//     });
//   };

//   return { broadcastUpdate };
// };
