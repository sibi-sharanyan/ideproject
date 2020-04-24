import React, { Component } from "react";
import AceEditor from "react-ace";

import { Button, Spin } from "antd";
import { Select, notification, Input } from "antd";
import { Layout } from "antd";

import "./App.css";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-monokai";

import "brace/ext/language_tools";

import Axios from "axios";
// http://localhost:8000/
// https://enigmatic-brook-34827.herokuapp.com/

let prod = true;
const { Option } = Select;
const {  Footer, Content } = Layout;
const { TextArea } = Input;

const axinst = Axios.create({
  baseURL: prod
    ? "https://enigmatic-brook-34827.herokuapp.com/"
    : "http://localhost:8000/",
  timeout: 15000,
});

export default class App extends Component {
  openNotificationWithIcon = () => {
    notification["error"]({
      message: "An error occured",
      description:
        this.state.stdin === ""
          ? "The server took too long to respond."
          : "Make sure the input doesn't contain unneccary data.",
    });
  };

  state = {
    modes: [
      {
        name: "Python",
        value: "python",
        defaultCode: `print("Hello, World!")`,
      },
      {
        name: "C/C++",
        value: "c_cpp",
        defaultCode: `#include <stdio.h>
      int main() {
         printf("Hello, World!");
         return 0;
      }`,
      },
      {
        name: "Java",
        value: "java",
        defaultCode: `public class Simple{  
        public static void main(String args[]){  
         System.out.println("Hello, World!");  
        }  
    }  `,
      },
      {
        name: "JavaScript",
        value: "javascript",
        defaultCode: `console.log( 'Hello, World!' );`,
      },
    ],
    selectedMode: 0,
    loading: false,
    stdin: "",
  };

  onChange = (value, selectedMode) => {
    let obj = this.state.modes;
    obj[selectedMode].defaultCode = value;
  };

  handleChange = (value) => {
    console.log(value);
  };

  runCode = () => {
    this.setState({
      stdout: "",
      exitcode: "",
      memoryUsage: "",
      cpuUsage: "",
      stderr: "",
      loading: true,
    });
    let code = this.state.modes[this.state.selectedMode].defaultCode;
    axinst
      .post("/runcode", {
        code,
        selectedMode: this.state.selectedMode,
        stdin: this.state.stdin,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.stderr === "") {
          this.setState({
            stdout: data.stdout,
            stderr: data.stderr,
            exitcode: data.exitCode,
            memoryUsage: data.memoryUsage,
            cpuUsage: data.cpuUsage,
            errorType: data.errorType,
            loading: false,
          });
        } else {
          this.setState({
            stdout: data.stderr,
            stderr: data.stderr,
            exitcode: data.exitCode,
            memoryUsage: data.memoryUsage,
            cpuUsage: data.cpuUsage,
            errorType: data.errorType,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
        this.openNotificationWithIcon();
      });
  };

  render() {
    return (
      <div style={{ height: "90vh" }}>
        <Layout>
          <Content>
            <div className="d-flex justify-content-around align-items-center">
              <div className="d-flex flex-column align-items-center justify-content-around">
                <div className="my-2">
                  <Select
                    defaultValue={
                      this.state.modes[this.state.selectedMode].name
                    }
                    style={{ width: 120 }}
                    onChange={(value) => this.setState({ selectedMode: value })}
                  >
                    {this.state.modes.map((mode, ind) => {
                      return (
                        <Option key={ind} value={ind}>
                          {mode.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>

                <div className="">
                  <AceEditor
                    height="75vh"
                    width="60vw"
                    placeholder="Online IDE developed by Sibi Sharanyan"
                    mode={this.state.modes[this.state.selectedMode].value}
                    theme="monokai"
                    name="blah2"
                    onLoad={this.onLoad}
                    onChange={(value) =>
                      this.onChange(value, this.state.selectedMode)
                    }
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={
                      this.state.modes[this.state.selectedMode].defaultCode
                    }
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 4,
                      showPrintMargin: false,
                    }}
                  />
                </div>

                <div className="my-2 d-flex align-items-center justify-content-around">
                  <Button
                    disabled={this.state.loading}
                    onClick={() => this.runCode()}
                    type="primary"
                  >
                    Compile and Run
                  </Button>

                  <Spin className="ml-4" spinning={this.state.loading} />
                </div>
              </div>

              <div className="">
                <div style = {{width: "30vw"}}  className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">
                    Enter input
                  </label>

                  <TextArea
                    value={this.state.stdin}
                    onChange={(e) => this.setState({ stdin: e.target.value })}
                    rows={10}
                    
                  />
                </div>

                <div style = {{width: "30vw"}}  className="form-group">
                  <label htmlFor="exampleFormControlTextarea2">Output</label>

                  <TextArea   readOnly value={this.state.stdout} rows={10} />
                </div>
              </div>
            </div>
          </Content>
          <Footer>
            <div className="d-flex flex-column justify-content-center">
              <div className=" d-flex flex-column align-items-center justify-content-center">
                <div>
                  <p className="lead">
                    Made with <a style={{ color: "black" }} href="https://nodejs.org/"> <i class="mx-1 fab fa-node-js"></i> </a>  and <a href="https://www.docker.com/"> <i style={{ color: "black" }} class="mx-1 fab fa-docker"></i> </a>  by <strong> Sibi </strong>{" "}
                  </p>
                </div>

                <div className="w-25 d-flex justify-content-between align-items-center">
                  <div>
                    <a
                      style={{ color: "black" }}
                      href="https://github.com/sibi-sharanyan"
                    >
                      <i class="fab fa-github fa-2x"></i>
                    </a>
                  </div>

                  <div>
                    <a
                      style={{ color: "black" }}
                      href="https://www.linkedin.com/in/sibi-sharanyan"
                    >
                      <i class="fab fa-linkedin fa-2x"></i>
                    </a>
                  </div>

                  <div>
                    <a
                      style={{ color: "black" }}
                      href="mailto:sibisharanyanit@gmail.com"
                    >
                      <i class="fas fa-envelope fa-2x"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Footer>
        </Layout>
      </div>
    );
  }
}
