import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
const API = 'http://localhost:8090/cafe/otp/';
import axios from 'axios';
import {
    useHistory
} from 'react-router-dom';


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
            loginButton: false,
            errorText: '',
            otp: 4555,
            otpValue: 0,
            userName: ''
        };
    }

    handleOnChange(e) {
        const phoneRegex = /^(?=(?:\D*\d){10,10}\D*$)\+?[0-9]{1,3}[\s-]?(?:\(0?[0-9]{1,5}\)|[0-9]{1,5})[-\s]?[0-9][\d\s-]{5,7}\s?(?:x[\d-]{0,4})?$/;
        if (e.target.value.match(phoneRegex)) {
            this.setState({ phone: e.target.value, errorText: '' })
        } else {
            this.setState({ errorText: 'Invalid format: ###-###-####' })
        }
    }

    async handleOtpButton () {
        try {
            // const phoneNumber = this.state.phone;
            // const userName = this.state.userName;
            // const result = await axios.get(API + phoneNumber + userName);
            // console.log(result);
            this.setState({otpButton: false, loginButton: true})
        } catch (error) {
            // this.setState({
            //     error,
            //     isLoading: false
            // });
        }
        
    }

    handleLogin(){
        const history = useHistory();
        if(this.state.otpValue === this.state.otp.toString()){
            return history.push('/placeOrder');
        }else{
            alert('Failed');
        }
    }

    handleOtp(e){
        this.setState({otpValue: e.target.value});
    }

    handleUserName(e){
        this.setState({userName: e.target.value});
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
                            <TextField id="phoneNumber" label="Phone Number" type="number" onChange={this.handleOnChange.bind(this)} helperText= {this.state.errorText} fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    { !this.state.otpButton &&
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <Fingerprint />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField id="number" label="Otp" type="number" onChange={this.handleOtp.bind(this)} fullWidth required />
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
                            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleLogin.bind(this)}>Login</Button>
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