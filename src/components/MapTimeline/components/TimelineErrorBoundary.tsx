import {Component, ErrorInfo, ReactNode} from 'react';
import {Typography, Button, Box} from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TimelineErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Timeline error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({hasError: false, error: undefined});
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{p: 3, textAlign: 'center'}}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong displaying the timeline.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {this.state.error?.message}
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
