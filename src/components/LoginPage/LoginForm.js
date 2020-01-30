import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing.unit
    }
});


class LoginForm extends React.Component {
    constructor (args) {
        super(args);

        this.state = {
            phone: 0,
            otpButton: true,
            loginButton: false
        };
    }

    handleOnChange(e) {
        this.setState({ phone: e.target.value })
    }

    handleOtpButton(){
        this.setState({otpButton: false, loginButton: true})
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="string" fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="number" label="Phone Number" type="number" onChange={this.handleOnChange.bind(this)} fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    { !this.state.otpButton &&
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <Fingerprint />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField id="number" label="Otp" type="number" fullWidth required />
                            </Grid> 
                        </Grid>
                    }
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                        
                    </Grid>
                    { this.state.loginButton &&
                        <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button variant="outlined" color="primary" style={{ textTransform: "none" }}>Login</Button>
                        </Grid>
                    }
                    { this.state.otpButton && this.state.phone.length === 10 &&
                        <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleOtpButton.bind(this)}>Get Otp</Button>
                        </Grid>
                    }
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(LoginForm);