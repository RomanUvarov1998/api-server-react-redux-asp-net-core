import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { TableContainer } from './table-container/table-container'
import { Patient } from "../library/patient";
import { Provider } from 'react-redux';
import { configureStore, createInitialState } from '../store/my-store'

type AppProps = {

}
export type AppState = {
  patientsList: Patient[],
  patientTemplate: Patient,
  editingId: number,
}

export class App extends React.Component<AppProps, AppState, {}> {
  state: AppState;
  store: any;

  constructor(props: AppProps) {
    super(props);
   
    this.state = createInitialState();

    this.store = configureStore(this.state);
  }

  render(): React.ReactNode {
    return (
      <div>
        <Provider store={this.store}>
          <TableContainer />
        </Provider>
      </div>
    );
  }
}

export default App;
