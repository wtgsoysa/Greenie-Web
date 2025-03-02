import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import CartButton from '../components/CartButton';
import { LuArrowRight } from 'react-icons/lu';
import ShopNav from '../components/ShopNav';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const total = getCartTotal();

  const handleCheckout = () => {
    navigate('/shop/checkout');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div className="max-w-screen-xl container mx-auto px-4 md:px-0">
      {/* Global nav */}
      <div className="bg-green-300 py-4 mx-auto my-3 md:my-5 rounded-lg">
        <p className="text-center">Global Nav</p>
      </div>

      <ShopNav />

      <div className="my-4">
        <Breadcrumb
          items={[{ label: 'Shop', link: '/shop' }, { label: 'Cart' }]}
        />
      </div>

      <div className="my-8">
        <h1 className="text-2xl md:text-3xl font-medium text-text-gray mb-6">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-12 gap-8">
          {/* Cart Items Section */}
          <div className="col-span-12 lg:col-span-7">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="text-primary-green hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItemCard
                  key={item.productID}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))
            )}
          </div>

          {/* Summary Section - 5 columns */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-bg-light p-6 rounded-3xl sticky top-4 max-w-md mx-auto lg:mx-0">
              <h2 className="text-xl font-medium text-text-gray mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium pt-3 border-t">
                  <span>Total</span>
                  <span>Rs {total}</span>
                </div>
              </div>

              <CartButton
                icon={<LuArrowRight />}
                text="Proceed to Checkout"
                className="bg-primary-green mt-6"
                textColor="text-white"
                onClick={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
