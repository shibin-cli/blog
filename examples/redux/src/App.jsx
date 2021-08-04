import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as countActions from './store/actions'

function App(props) {
  return (
    <div className="App">
      <p> count:
        <button onClick={() => props.deplay_increment(5)}>-</button>{props.count}<button onClick={() => props.increment(1)}>-</button></p>

      <p><button onClick={() => props.delayShowModal(true)}>显示</button><button  onClick={() => props.delayShowModal(false)}>隐藏</button></p>
      {
        props.show? <div >aaaaa</div>:''
      }
     
    </div>
  );
}
const mapStateToProps = state => ({
  count: state.counter.count,
  show: state.modal.show
})
const mapDispatchToProps = dispatch => bindActionCreators(countActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App);
