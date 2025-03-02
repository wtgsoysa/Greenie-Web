import { useCart } from '../context/CartContext';

const Notification = () => {
  const { showNotification, notificationMessage } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-primary-green text-white px-6 py-3 rounded-full shadow-lg z-50 animate-slide-up">
      {notificationMessage}
    </div>
  );
};

export default Notification;
