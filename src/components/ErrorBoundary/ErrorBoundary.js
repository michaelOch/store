import React from 'react';
import Spinner from '../Spinner/Spinner';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    // static getDerivedStateFromError(error) {
    //     return { hasError: true }
    // }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        return (
            <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{backgroundColor: '#000000', opacity: '0.8', height: '100vh'}}>
                <h1 className="text-info">Oops!!!</h1>
                <h6 className="text-warning">Something went wrong...</h6>
                <Spinner />
            </div>
        )
      } else {
        return this.props.children;
      }
    }
  }

  export default ErrorBoundary;