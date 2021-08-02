import {connect} from 'react-redux'

function App(props) {
  return (
    <div className="App">
      count:
      <button onClick={props.decrement}>-</button>{props.count}<button onClick={props.increment}>-</button>
    </div>
  );
}
const mapStateToProps = state=>({
  count: state.count
})
const mapDispatchToProps = dispatch =>({
  increment(){
    return dispatch({
      type: 'increment'
    })
  },
  decrement(){
    return dispatch({
      type: 'decrement'
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(App);
