import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: Timestamp | Date) => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  try {
    return new Date(date);
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return new Date();
  }
};
