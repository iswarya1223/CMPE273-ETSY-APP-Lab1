import React, { Fragment,useEffect,useState} from "react";
import {Redirect} from "react-router-dom";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart,removeItemsFromCart,getCartDetails} from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { addOrderDetails} from "../../actions/orderAction";


const Cart = ({history}) =>{
 const dispatch = useDispatch();
 const {isAuthenticated,user} =useSelector(
  (state) => state.auth
);

const [formData, setFormData] = useState({
  subtotal: '1',
  grosstotal: '1'
});
//const successlogin = '';
const {subtotal,grosstotal} = formData;
console.log(subtotal);
console.log(grosstotal);
const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value});
const email=user[0].email;
useEffect(() => {
  dispatch(getCartDetails(email));
}, [dispatch,email]);
 const increaseQuantity = (productid, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
      const email = user[0].email;
      dispatch(addItemsToCart(productid, newQty,email));
      dispatch(getCartDetails(email));
  };

  const decreaseQuantity = (productid, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    const email = user[0].email;
      dispatch(addItemsToCart(productid, newQty,email));
      dispatch(getCartDetails(email));
  };

  const deleteCartItems = (productid) => {
    const email = user[0].email;
    dispatch(removeItemsFromCart(productid,email));
    dispatch(getCartDetails(email));
  };

  const { cartItems } = useSelector((state) => state.cart);
  const checkoutHandler = () => {
    dispatch(addOrderDetails(email));
    history.push("/mypurchases");
  };
    return (
    <Fragment>
        {cartItems.length === 0  ?(
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ): (<Fragment>
        <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            </div>
            {cartItems &&
              cartItems.map((item) => (
            <div className="cartContainer" key={item.productid}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                  <div className="cartInput">
                  <button onClick={() =>
                        decreaseQuantity(item.productid, item.quantity)
                      }>
                      -
                </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={() =>
                        increaseQuantity(
                          item.productid,
                          item.quantity,
                          item.stock
                        )
                      }>
                      +
                    </button>
                </div>
                <p className="cartSubtotal">{
                    item.currency
                  } {`${
                    item.price * item.quantity
                  }`} </p>
                </div>
                 ))}
                <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`} </p>
              </div>
              <div></div>
              <div className="checkOutBtn">
              <button type="submit" onClick={checkoutHandler}>Check Out</button>
              </div>
              </div>
    </Fragment>)
    }
    </Fragment>
    );
}
export default Cart;
