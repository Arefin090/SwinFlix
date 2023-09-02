// import { createStore } from 'vuex';

// export default createStore({
//   state: {
//     cartItems: [],
//   },
//   mutations: {
//     setCartItems(state, items) {
//       state.cartItems = items;
//     },
//   },
//   actions: {
//     fetchCartItems({ commit }) {
//       const items = JSON.parse(localStorage.getItem('cart')) || [];
//       commit('setCartItems', items);
//     },
//     addToCart({ commit, state }, item) {
//       const items = [...state.cartItems, item];
//       localStorage.setItem('cart', JSON.stringify(items));
//       commit('setCartItems', items);
//     },
//   },
// });
