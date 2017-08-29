package com.rnfile;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import com.facebook.react.bridge.*;

import javax.annotation.Nullable;
import java.io.File;
import java.io.FilenameFilter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by xiaokecong on 28/08/2017.
 */
public class RNFileManager extends ReactContextBaseJavaModule {
    private final String E_GET_IMAGE_ERROR = "get_image_error";
    private static final String TYPE_FILE = "TYPE_FILE";
    private static final String TYPE_FOLDER = "TYPE_FOLDER";

    public RNFileManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNFileManager";
    }

    @ReactMethod
    public void getImageFiles(Promise promise) {
        WritableArray imageFileArr = Arguments.createArray();
        try {
            Uri imgUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            ContentResolver resolver = MainApplication.getInstance().getContentResolver();
            String selection =
                    MediaStore.Images.Media.MIME_TYPE + "=? or " + MediaStore.Images.Media.MIME_TYPE + "=?";
            String[] selectionArgs = new String[]{"image/jpeg", "image/png"};
            String sortOrder = MediaStore.Images.Media.DATE_MODIFIED + " DESC";
            Cursor cursor = resolver.query(imgUri, null, selection, selectionArgs, sortOrder);

            if (cursor.getCount() > 0) {
                while (cursor.moveToNext()) {
                    String path = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
                    WritableMap fileMap = Arguments.createMap();
                    fileMap.putString("imgPath", path);

                    imageFileArr.pushMap(fileMap);
                }


                Log.e("===>xkc","fileArr:"+imageFileArr);
                promise.resolve(imageFileArr);
            }
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(E_GET_IMAGE_ERROR, e.getMessage());
        }
    }


    @ReactMethod
    public void getImageFolders(Promise promise) {
        WritableArray imageArr = Arguments.createArray();
        String firstImagePath = null;
        Set<String> dirPathSet = new HashSet<>(); // 辅助set，防止一个目录被扫描多次

        try {
            Uri imgUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            ContentResolver resolver = MainApplication.getInstance().getContentResolver();
            String selection =
                    MediaStore.Images.Media.MIME_TYPE + "=? or " + MediaStore.Images.Media.MIME_TYPE + "=?";
            String[] selectionArgs = new String[]{"image/jpeg", "image/png"};
            String sortOrder = MediaStore.Images.Media.DATE_MODIFIED + " DESC";
            Cursor cursor = resolver.query(imgUri, null, selection, selectionArgs, sortOrder);

            if (cursor.getCount() > 0) {
                while (cursor.moveToNext()) {
                    String path = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));

                    if (null == firstImagePath) {
                        firstImagePath = path; // 第一张图片路径
                    }

                    File parentFile = new File(path).getParentFile();
                    if (null == parentFile) {
                        continue;
                    }

                    String dirPath = parentFile.getAbsolutePath();
                    WritableMap folderMap = null;

                    if (dirPathSet.contains(dirPath)) {
                        continue;
                    } else {
                        dirPathSet.add(dirPath);

                        folderMap = Arguments.createMap();
                        folderMap.putString("folderPath", dirPath);
                        folderMap.putString("firstImgPath", path);
                    }

                    if (null == parentFile.list()) {
                        continue;
                    }

                    int picSize = parentFile.list(new FilenameFilter() {
                        @Override
                        public boolean accept(File dir, String filename) {
                            return filename.endsWith(".jpg")
                                    || filename.endsWith(".png")
                                    || filename.endsWith(".jpeg");
                        }
                    }).length;

                    folderMap.putInt("imgCount", picSize);
                    imageArr.pushMap(folderMap);
                }
                Log.e("===>xkc","folderArr:"+imageArr);
                promise.resolve(imageArr);

            }
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(E_GET_IMAGE_ERROR, e.getMessage());
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(TYPE_FILE, TYPE_FILE);
        constants.put(TYPE_FOLDER, TYPE_FOLDER);
        return constants;
    }
}
