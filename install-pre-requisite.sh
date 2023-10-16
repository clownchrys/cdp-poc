#!/bin/bash

KERNEL_NAME=$(uname)
echo "KERNEL_NAME: ${KERNEL_NAME}"

function install_docker() {
    if [[ ${KERNEL_NAME} = "Linux" ]]; then
        if which apt > /dev/null; then
            script='apt update && apt install -y docker-ce'
        elif which yum > /dev/null; then
            script='yum install docker-ce'
        fi
    elif [[ ${KERNEL_NAME} = "Darwin" ]]; then
        script='brew install docker-ce'
    else
        echo "Invalid Kernel: ${KERNEL_NAME}" && exit 1
    fi

    echo "installing docker..."
    echo ${script}
}

function install_make() {
    if [[ ${KERNEL_NAME} = "Linux" ]]; then
        if which apt > /dev/null; then
            script='apt update && apt install -y make'
        elif which yum > /dev/null; then
            script='yum install make'
        fi
    elif [[ ${KERNEL_NAME} = "Darwin" ]]; then
        script='brew install make'
    else
        echo "Invalid Kernel: ${KERNEL_NAME}" && exit 1
    fi

    echo "installing make..."
    echo ${script}
}

if ! which docker > /dev/null; then
    install_docker;
else
    echo "docker-system already installed...";
fi

if ! which make > /dev/null; then
    install_make;
else
    echo "make already installed...";
fi

install_docker