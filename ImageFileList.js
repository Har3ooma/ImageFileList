import { useEffect, useState } from "react";

import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";

import { defaultImagePaths } from "constants/defaults";

import { prepareImageURL } from "helpers/imageUtils";

import { useDroppableFileList } from "hooks";

import { CloseButton } from "components";

const prepareImageFiles = (files) => files.reduce((res, file) => {
    if (file && !defaultImagePaths.set.has(file))
        res.push(prepareImageURL(file));
    return res;
}, []);

const ImageFile = ({src, onDelete}) => {
    return (
        <GridItem className="file-list__item-wrapper">
            <div className="file-list__item">
                <img
                    className="file-list__item__image"
                    src={src}
                    alt={src}
                    draggable={false}
                />
                <CloseButton
                    className="file-list__item__delete"
                    danger={true}
                    onClick={onDelete}
                />
            </div>
        </GridItem>
    )
};

const ImageFileList = ({children, files, onSwap, onDelete}) => {
    const [preparedImageFiles, setPreparedImageFiles] = useState(() => prepareImageFiles(files));
    const fileListProps = useDroppableFileList(preparedImageFiles);

    const handleChange = (sourceId, sourceIndex, targetIndex) => {
        setPreparedImageFiles(swap(preparedImageFiles, sourceIndex, targetIndex));
        onSwap(swap(files, sourceIndex, targetIndex));
    };

    useEffect(() => {
        if (files && files.length !== preparedImageFiles.length) {
            setPreparedImageFiles(prepareImageFiles(files));
        }
    }, [files]);

    return (
        <GridContextProvider onChange={handleChange}>
            <GridDropZone
                boxesPerRow={3}
                rowHeight={86}
                id="file-list-droppable"
                className="file-list"
                style={{
                    height: `${fileListProps.listHeight}px`
                }}
            >
                {preparedImageFiles.map((item, index) => {
                    return (
                        <ImageFile
                            key={item}
                            src={item}
                            onDelete={() => {
                                onDelete(index);
                                setPreparedImageFiles(prev => prev.filter((item, i) => i !== index));
                            }}
                        />
                    );
                })}
                {children(fileListProps)}
            </GridDropZone>
        </GridContextProvider>
    );
};

export default ImageFileList;
