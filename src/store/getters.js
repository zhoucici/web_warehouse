const getters = {
  user: state => state.user,
  _userinfo: state => state.user._userinfo,
  isadmin: state=>state.user._userinfo.admin
}
export default getters
