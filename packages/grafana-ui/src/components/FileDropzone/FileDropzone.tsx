import { css, cx } from '@emotion/css';
import { isString, uniqueId } from 'lodash';
import React, { ReactNode, useCallback, useState } from 'react';
import { Accept, DropEvent, DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';

import { GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes';
import { Alert } from '../Alert/Alert';
import { Icon } from '../Icon/Icon';

import { FileListItem } from './FileListItem';

type BackwardsCompatibleDropzoneOptions = Omit<DropzoneOptions, 'accept'> & {
  // For backward compatibility we are still allowing the old `string | string[]` format for adding accepted file types (format changed in v13.0.0)
  accept?: string | string[] | Accept;
};

export interface FileDropzoneProps {
  /**
   * Use the children property to have custom dropzone view.
   */
  children?: ReactNode;
  /**
   * Use this property to override the default behaviour for the react-dropzone options.
   * @default {
   *  maxSize: Infinity,
   *  minSize: 0,
   *  multiple: true,
   *  useFsAccessApi: false,
   *  maxFiles: 0,
   * }
   */
  options?: BackwardsCompatibleDropzoneOptions;
  /**
   * Use this to change the FileReader's read.
   */
  readAs?: 'readAsArrayBuffer' | 'readAsText' | 'readAsBinaryString' | 'readAsDataURL';
  /**
   * Use the onLoad function to get the result from FileReader.
   */
  onLoad?: (result: string | ArrayBuffer | null) => void;
  /**
   * The fileListRenderer property can be used to overwrite the list of files. To not to show
   * any list return null in the function.
   */
  fileListRenderer?: (file: DropzoneFile, removeFile: (file: DropzoneFile) => void) => ReactNode;
  onFileRemove?: (file: DropzoneFile) => void;
}

export interface DropzoneFile {
  file: File;
  id: string;
  error: DOMException | null;
  progress?: number;
  abortUpload?: () => void;
  retryUpload?: () => void;
}

export function FileDropzone({ options, children, readAs, onLoad, fileListRenderer, onFileRemove }: FileDropzoneProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const setFileProperty = useCallback(
    (customFile: DropzoneFile, action: (customFileToModify: DropzoneFile) => void) => {
      setFiles((oldFiles) => {
        return oldFiles.map((oldFile) => {
          if (oldFile.id === customFile.id) {
            action(oldFile);
            return oldFile;
          }
          return oldFile;
        });
      });
    },
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[], event: DropEvent) => {
      let customFiles = acceptedFiles.map(mapToCustomFile);
      if (options?.multiple === false) {
        setFiles(customFiles);
      } else {
        setFiles((oldFiles) => [...oldFiles, ...customFiles]);
      }

      setErrors(rejectedFiles);

      if (options?.onDrop) {
        options.onDrop(acceptedFiles, rejectedFiles, event);
      } else {
        for (const customFile of customFiles) {
          const reader = new FileReader();

          const read = () => {
            if (readAs) {
              reader[readAs](customFile.file);
            } else {
              reader.readAsText(customFile.file);
            }
          };

          // Set abort FileReader
          setFileProperty(customFile, (fileToModify) => {
            fileToModify.abortUpload = () => {
              reader.abort();
            };
            fileToModify.retryUpload = () => {
              setFileProperty(customFile, (fileToModify) => {
                fileToModify.error = null;
                fileToModify.progress = undefined;
              });
              read();
            };
          });

          reader.onabort = () => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.error = new DOMException('Aborted');
            });
          };

          reader.onprogress = (event) => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.progress = event.loaded;
            });
          };

          reader.onload = () => {
            onLoad?.(reader.result);
          };

          reader.onerror = () => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.error = reader.error;
            });
          };

          read();
        }
      }
    },
    [onLoad, options, readAs, setFileProperty]
  );

  const removeFile = (file: DropzoneFile) => {
    const newFiles = files.filter((f) => file.id !== f.id);
    setFiles(newFiles);
    onFileRemove?.(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...options,
    useFsAccessApi: false,
    onDrop,
    accept: transformAcceptToNewFormat(options?.accept),
  });
  const theme = useTheme2();
  const styles = getStyles(theme, isDragActive);
  const fileList = files.map((file) => {
    if (fileListRenderer) {
      return fileListRenderer(file, removeFile);
    }
    return <FileListItem key={file.id} file={file} removeFile={removeFile} />;
  });

  const setErrors = (rejectedFiles: FileRejection[]) => {
    let errors: string[] = [];
    rejectedFiles.map((rejectedFile) => {
      rejectedFile.errors.map((error) => {
        if (errors.indexOf(error.message) === -1) {
          errors.push(error.message);
        }
      });
    });

    setErrorMessages(errors);
  };

  const getErrorMessages = () => {
    return (
      <div className={styles.errorAlert}>
        <Alert title="上传失败" severity="error" onRemove={clearAlert}>
          {errorMessages.map((error) => {
            return <div key={error}>{error}</div>;
          })}
        </Alert>
      </div>
    );
  };

  const clearAlert = () => {
    setErrorMessages([]);
  };

  return (
    <div className={styles.container}>
      <div data-testid="dropzone" {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} />
        {children ?? <FileDropzoneDefaultChildren primaryText={getPrimaryText(files, options)} />}
      </div>
      {errorMessages.length > 0 && getErrorMessages()}
      {options?.accept && (
        <small className={cx(styles.small, styles.acceptMargin)}>{getAcceptedFileTypeText(options.accept)}</small>
      )}
      {fileList}
    </div>
  );
}

export function getMimeTypeByExtension(ext: string) {
  if (['txt', 'json', 'csv', 'xls', 'yml'].some((e) => ext.match(e))) {
    return 'text/plain';
  }

  return 'application/octet-stream';
}

export function transformAcceptToNewFormat(accept?: string | string[] | Accept): Accept | undefined {
  if (isString(accept)) {
    return {
      [getMimeTypeByExtension(accept)]: [accept],
    };
  }

  if (Array.isArray(accept)) {
    return accept.reduce((prev: Record<string, string[]>, current) => {
      const mime = getMimeTypeByExtension(current);

      prev[mime] = prev[mime] ? [...prev[mime], current] : [current];

      return prev;
    }, {});
  }

  return accept;
}

export function FileDropzoneDefaultChildren({
  primaryText = '上传文件',
  secondaryText = '拖放这里或浏览',
}) {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div className={styles.iconWrapper}>
      <Icon name="upload" size="xxl" />
      <h3>{primaryText}</h3>
      <small className={styles.small}>{secondaryText}</small>
    </div>
  );
}
function getPrimaryText(files: DropzoneFile[], options?: BackwardsCompatibleDropzoneOptions) {
  if (options?.multiple === undefined || options?.multiple) {
    return '上传文件';
  }
  return files.length ? '替换文件' : '上传文件';
}

function getAcceptedFileTypeText(accept: string | string[] | Accept) {
  if (isString(accept)) {
    return `可接受的文件类型: ${accept}`;
  }

  if (Array.isArray(accept)) {
    return `可接受的文件类型: ${accept.join(', ')}`;
  }

  // react-dropzone has updated the type of the "accept" parameter since v13.0.0:
  // https://github.com/react-dropzone/react-dropzone/blob/master/src/index.js#L95
  return `可接受的文件类型: ${Object.values(accept).flat().join(', ')}`;
}

function mapToCustomFile(file: File): DropzoneFile {
  return {
    id: uniqueId('file'),
    file,
    error: null,
  };
}

function getStyles(theme: GrafanaTheme2, isDragActive?: boolean) {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    dropzone: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      padding: ${theme.spacing(6)};
      border-radius: 2px;
      border: 2px dashed ${theme.colors.border.medium};
      background-color: ${isDragActive ? theme.colors.background.secondary : theme.colors.background.primary};
      cursor: pointer;
    `,
    iconWrapper: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
    acceptMargin: css`
      margin: ${theme.spacing(2, 0, 1)};
    `,
    small: css`
      color: ${theme.colors.text.secondary};
    `,
    errorAlert: css`
      padding-top: 10px;
    `,
  };
}
