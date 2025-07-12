import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Clock,
  Check,
  MapPin,
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuItems {
  appetizers: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  beverages: MenuItem[];
}

type ViewType = "menu" | "cart" | "success";

const Menu: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>("menu");
  const [_orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber] = useState<number>(Math.floor(Math.random() * 1000) + 1);
  const [restaurantName] = useState<string>("Bella Vista");
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  // Extract table number from URL path
  useEffect(() => {
    const path = window.location.pathname;
    const tableMatch = path.match(/\/table\/(\d+)/);
    if (tableMatch) {
      setTableNumber(parseInt(tableMatch[1]));
    } else {
      // For demo purposes, if no table in URL, default to table 1
      setTableNumber(1);
    }
  }, []);

  // Mock menu data
  const menuItems: MenuItems = {
    appetizers: [
      {
        id: 1,
        name: "Truffle Arancini",
        price: 14,
        description: "Crispy risotto balls with truffle oil & parmesan",
        image: "🍚",
        popular: true,
      },
      {
        id: 2,
        name: "Burrata Caprese",
        price: 16,
        description: "Fresh burrata, heirloom tomatoes, basil oil",
        image: "🧀",
        popular: false,
      },
      {
        id: 3,
        name: "Crispy Calamari",
        price: 13,
        description: "Golden fried squid with spicy marinara",
        image: "🦑",
        popular: true,
      },
    ],
    mains: [
      {
        id: 4,
        name: "Wagyu Ribeye",
        price: 48,
        description: "12oz premium cut, herb butter, seasonal vegetables",
        image: "🥩",
        popular: true,
      },
      {
        id: 5,
        name: "Lobster Ravioli",
        price: 28,
        description: "Handmade pasta, lobster filling, saffron cream",
        image: "🦞",
        popular: false,
      },
      {
        id: 6,
        name: "Duck Confit",
        price: 32,
        description: "Slow-cooked duck leg, cherry gastrique",
        image: "🦆",
        popular: true,
      },
    ],
    desserts: [
      {
        id: 7,
        name: "Tiramisu",
        price: 12,
        description: "Classic Italian dessert, mascarpone, espresso",
        image: "🍰",
        popular: true,
      },
      {
        id: 8,
        name: "Chocolate Lava Cake",
        price: 14,
        description: "Warm chocolate cake, vanilla bean ice cream",
        image: "🍫",
        popular: false,
      },
    ],
    beverages: [
      {
        id: 9,
        name: "Craft Beer",
        price: 8,
        description: "Local IPA, citrus notes",
        image: "🍺",
        popular: true,
      },
      {
        id: 10,
        name: "House Wine",
        price: 12,
        description: "Cabernet Sauvignon, glass",
        image: "🍷",
        popular: false,
      },
      {
        id: 11,
        name: "Artisan Coffee",
        price: 5,
        description: "Single origin, freshly roasted",
        image: "☕",
        popular: true,
      },
    ],
  };

  const addToCart = (item: MenuItem): void => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: number): void => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = (): void => {
    setOrderPlaced(true);
    setCurrentView("success");
    // In real app, this would send to backend
    console.log("Order placed:", {
      orderNumber,
      tableNumber,
      items: cart,
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
    });
  };

  const MenuSection: React.FC<{ title: string; items: MenuItem[] }> = ({
    title,
    items,
  }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-amber-400 pb-2">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{item.image}</span>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.name}
                  </h3>
                  {item.popular && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">
                    ${item.price}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CartView: React.FC = () => (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView("menu")}
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            ← Back to Menu
          </button>
          <h1 className="text-2xl font-bold">Your Order</h1>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="text-amber-400">
            Order #{orderNumber} • {restaurantName}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <MapPin className="w-4 h-4" />
            Table {tableNumber}
          </div>
        </div>
      </div>

      <div className="p-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-amber-600">
                  ${getTotalPrice()}
                </span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const SuccessView: React.FC = () => (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-green-100">Thank you for your order</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Table:</span>
              <span className="font-medium">{tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-medium">{getTotalItems()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-amber-600">
                ${getTotalPrice()}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Estimated time: 15-20 minutes</span>
          </div>

          <p className="text-gray-600">
            Your order has been sent to the kitchen. We'll bring it to your
            table when ready!
          </p>

          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Table {tableNumber}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView("menu");
              setCart([]);
              setOrderPlaced(false);
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors duration-200"
          >
            Order More Items
          </button>
        </div>
      </div>
    </div>
  );

  const MenuView: React.FC = () => (
    <div className="max-w-md mx-auto bg-gray-50 ">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{restaurantName}</h1>
            <p className="text-gray-300">Fine Dining Experience</p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 text-sm">Order #{orderNumber}</div>
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <MapPin className="w-3 h-3" />
              <span>Table {tableNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <MenuSection title="Appetizers" items={menuItems.appetizers} />
        <MenuSection title="Main Courses" items={menuItems.mains} />
        <MenuSection title="Desserts" items={menuItems.desserts} />
        <MenuSection title="Beverages" items={menuItems.beverages} />
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => setCurrentView("cart")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart ({getTotalItems()}) • ${getTotalPrice()}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="font-Poppins">
      {currentView === "menu" && <MenuView />}
      {currentView === "cart" && <CartView />}
      {currentView === "success" && <SuccessView />}
    </div>
  );
};

export default Menu;
