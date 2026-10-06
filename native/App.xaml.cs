using System;
using System.Windows;
namespace Cl4nLoader
{
    public partial class App : Application
    {
        public App()
        {
            DispatcherUnhandledException += (s, e) =>
            {
                MessageBox.Show("Ошибка: " + e.Exception.Message + "\n\n" + e.Exception.StackTrace, "764 CL4N Loader");
                e.Handled = true;
            };
        }
    }
}
