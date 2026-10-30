import { Component } from "react";

// Keeps a failing 3D scene (missing model, shader or driver error) from
// unmounting the page: renders `fallback` instead and reports the error once.
export default class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
