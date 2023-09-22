import React, { ReactNode } from "react";
import Sider from "antd/lib/layout/Sider";
import { Layout, Menu } from "antd";

function SidebarLayout() {
    return (
        <Sider theme="light">
            <Menu mode="vertical">
                <Menu.Item>1</Menu.Item>
                <Menu.Item>2</Menu.Item>
                <Menu.Item>3</Menu.Item>
                <Menu.Item>4</Menu.Item>
            </Menu>
        </Sider>
    )
}

function ContentLayout({children}: React.PropsWithChildren<ReactNode>) {
    return (
        <Layout className="site-layout" style={{height: "100vh", overflowY: "auto"}}>
            <Layout.Content style={{margin: 30}}>
                {children}
            </Layout.Content>
        </Layout>
    )
}

export default function MainLayout({children}: React.PropsWithChildren<ReactNode>) {
   return (
        <Layout hasSider>
            <SidebarLayout/>
            {/* @ts-ignore */}
            <ContentLayout>
                {children}
            </ContentLayout>
        </Layout>
   ) 
}