export default function sidebarReducer(state = { isSidebarOpen: false }, action) {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen };
        default:
            return state;
    }
}