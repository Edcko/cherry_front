import { reactive } from "vue";

const state = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null,
});

const mutations = { 
    setUser(state, user){
        state.user = user;
    },
    setCitas(state,citas){
        state.citas = citas;
    }
};


export default {state, mutations};