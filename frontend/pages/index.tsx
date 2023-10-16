import _ from "lodash"
import { Button, Form, Input } from "antd"
import { useRouter } from "next/router";
import { login } from "@/utils/login";

type FieldType = {
    username?: string;
    password?: string;
}
  
const USERNAME = "admin"
const PASSWORD = "admin"

export default function Index() {
    const router = useRouter()

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={({username, password}: FieldType) => {
                if (username == USERNAME && password == PASSWORD) {
                    login()
                    router.push("/jk")
                } else {
                    alert("ID/PW 를 확인해주세요")
                }
            }}
            onFinishFailed={(errorInfo: any) => {
                alert("로그인에 실패하였습니다")
                console.log('Login Failed:', errorInfo)
            }}
            autoComplete="off"
            style={{
                maxWidth: 600,
                margin: "auto",
                marginTop: 100,
            }}
        >
            <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
        
            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
        
            {/* <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}
    
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
      </Form>
    
    )
}