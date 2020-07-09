import React, { FC, useRef, ChangeEvent, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from "./dragger";

export type UploadFileStatus = "ready" | "uploading" | "success" | "error"; // 上传文件状态
export interface UploadFile {
  uid: string; // 文件uid：通过 【Date.now() + "upload-file"】 生成
  size: number; // 文件大小
  name: string; // 文件名
  status?: UploadFileStatus; // 文件上传状态
  percent?: number; // 文件上传进度
  raw?: File; // 原始File
  response?: any; // 文件上传成功返回数据
  error?: any; // 文件上传错误返回数据
}
export interface UploadProps {
  /** 上传的地址 */
  action: string;
  /** 默认已经上传的文件列表 */
  defaultFileList?: UploadFile[];
  /** 文件读取前的回调函数，参数为上传的文件。支持返回一个 Promise 对象 */
  beforeUpload?: (file: File) => boolean | Promise<File>;
  /** 文件上传进度的回调函数 */
  onProgress?: (percentage: number, file: File) => void;
  /** 文件上传成功的回调函数 */
  onSuccess?: (data: any, file: File) => void;
  /** 文件上传错误的回调函数 */
  onError?: (err: any, file: File) => void;
  /** 文件上传成功的回调函数 */
  onChange?: (file: File) => void;
  /** 文件移除的回调函数 */
  onRemove?: (file: UploadFile) => void;
  /** axios headers */
  headers?: { [key: string]: any };
  /** 发到后台的文件参数名 */
  name?: string;
  /** 上传所需额外参数 */
  data?: { [key: string]: any };
  /** 请求是否携带 cookie */
  withCredentials?: boolean;
  /** 接受上传的文件类型 */
  accept?: string;
  /** 是否支持多选文件 */
  multiple?: boolean;
  /** 是否支持拖动上传 */
  drag?: boolean;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    drag,
  } = props;
  const fileInput = useRef<HTMLInputElement>(null); // input DOM - Ref
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  // 更新文件列表
  const updateFileList = (
    updateFile: UploadFile,
    updateObj: Partial<UploadFile>
  ) => {
    setFileList((prevList) => {
      return prevList.map((file) => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj };
        } else {
          return file;
        }
      });
    });
  };
  // input[type="file"] 模拟点击
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };
  // input[type="file"] change事件
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    uploadFiles(files); // 上传文件
    // 处理 input[type="file"] change事件只执行一次 问题
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };
  // 点击移除文件的事件
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid);
    });
    // 触发文件移除回调 - props: onRemove
    if (onRemove) {
      onRemove(file);
    }
  };
  // 上传文件
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files);
    postFiles.forEach((file) => {
      if (!beforeUpload) {
        post(file);
      } else {
        // beforeUpload - 上传文件之前的钩子
        const result = beforeUpload(file);
        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile);
          });
        } else if (result !== false) {
          post(file);
        }
      }
    });
  };
  const post = (file: File) => {
    let _file: UploadFile = {
      uid: Date.now() + "upload-file",
      status: "ready",
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    };
    setFileList((prevList) => {
      return [_file, ...prevList];
    });
    const formData = new FormData();
    formData.append(name || "file", file);
    // 上传所需额外参数
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    axios
      .post(action, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials, // 请求是否携带 cookie
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: "uploading" });
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then((resp) => {
        updateFileList(_file, { status: "success", response: resp.data });
        if (onSuccess) {
          // 触发文件上传成功回调 - props: onSuccess
          onSuccess(resp.data, file);
        }
        if (onChange) {
          onChange(file);
        }
      })
      .catch((err) => {
        updateFileList(_file, { status: "error", error: err });
        if (onError) {
          // 触发文件上传失败回调 - props: onError
          onError(err, file);
        }
        if (onChange) {
          onChange(file);
        }
      });
  };

  return (
    <div className="viking-upload-component">
      <div
        className="viking-upload-input"
        style={{ display: "inline-block" }}
        onClick={handleClick}
      >
        {/* 是否使用拖拽上传 */}
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files);
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          className="viking-file-input"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>
      {/* 上传列表 */}
      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  );
};

Upload.defaultProps = {
  name: "file",
};
export default Upload;
