package com.newfine_frontend;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "newfine_frontend";
  }

//  @Override
//  protected void onCreate(Bundle savedInstanceState) {
//SplashScreen.show(this, R.style.SplashScreenTheme, true);   super.onCreate(null);
//
////    setContentView(R.layout.activity_uncaught);
////
////    Tread.setDefaultUncaughtExceptionHandler(new ExceptionHandl
//  }
//
//  @Override
//  protected void onCreate(Bundle savedInstanceState) {
//    super.onCreate(savedInstanceState);
//
//    setContentView(R.layout.activity_main);
//
//    Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler());
//  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme, true);
    super.onCreate(savedInstanceState);

//    setContentView(R.layout.activity_main);

    Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler());
  }

  public class ExceptionHandler implements Thread.UncaughtExceptionHandler {
    @Override
    public void uncaughtException(Thread t, Throwable e){
//      Log.e(TAG, "error-------> "+ e.toString());
      e.printStackTrace();
      android.os.Process.killProcess(android.os.Process.myPid());
      System.exit(10);
    }
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
