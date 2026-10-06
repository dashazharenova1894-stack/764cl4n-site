using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace Cl4nLoader
{
    public partial class MainWindow : Window
    {
        // адрес сайта; для теста без выкладки: переменная окружения CL4N_BASE=http://localhost:8080/
        static readonly string BASE = Norm(Environment.GetEnvironmentVariable("CL4N_BASE") ?? "https://young-wave-cd63.764cl4n.workers.dev/");
        static string Norm(string u) { u = u.Trim(); return u.EndsWith("/") ? u : u + "/"; }
        const string DC = "https://discord.gg/Bf2fKNza";
        static readonly HttpClient Http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        static readonly Dictionary<string, string[]> T = new Dictionary<string, string[]>
        {
            { "site",   new[] { "Сайт 764 CL4N: состав, клипы, результаты матчей, достижения и заявка в клан. Онлайн клана и новости в одном месте.", "" } },
            { "roster", new[] { "Состав команды: ники, роли и ссылки на профили игроков 764 CL4N.", "#roster" } },
            { "apply",  new[] { "Хочешь к нам? Заполни заявку: ник, опыт в HVH и клип. Она сразу придёт модераторам в Discord.", "#apply" } },
            { "dc",     new[] { "Сервер клана в Discord: чат, набор, разборы матчей и общение с командой.", DC } }
        };
        string cur = "site";
        bool online, busy;

        static string NickFile { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "764CL4N", "nick.txt"); } }

        public MainWindow()
        {
            InitializeComponent();
            LogHead.Text = "Список изменений (" + DateTime.Now.ToString("dd.MM.yyyy") + ")";
            LoadNick();
            Pick("site");
            Loaded += async (s, e) => await Check();
            Loaded += (s, e) =>
            {
                var spin = new System.Windows.Media.Animation.DoubleAnimation(0, 360, TimeSpan.FromSeconds(9))
                {
                    RepeatBehavior = System.Windows.Media.Animation.RepeatBehavior.Forever
                };
                System.Windows.Media.Animation.Timeline.SetDesiredFrameRate(spin, 30);
                LogoSpin.BeginAnimation(System.Windows.Media.Media3D.AxisAngleRotation3D.AngleProperty, spin);
            };
        }

        void Drag(object s, MouseButtonEventArgs e) { if (e.ChangedButton == MouseButton.Left) DragMove(); }
        void Close_Click(object s, RoutedEventArgs e) { Close(); }

        // ---- ник ----
        void LoadNick()
        {
            string n = "Гость";
            try { if (File.Exists(NickFile)) { var t = File.ReadAllText(NickFile).Trim(); if (t.Length > 0) n = t; } } catch { }
            ShowNick(n);
        }
        void ShowNick(string n) { NickText.Text = n; NickInit.Text = n.Length > 0 ? n.Substring(0, 1).ToUpper() : "?"; }
        void Nick_Click(object s, RoutedEventArgs e) { NickBox.Text = NickText.Text == "Гость" ? "" : NickText.Text; NickPanel.Visibility = Visibility.Visible; NickBox.Focus(); }
        void NickOk_Click(object s, RoutedEventArgs e)
        {
            var n = NickBox.Text.Trim();
            if (n.Length > 0)
            {
                try { Directory.CreateDirectory(Path.GetDirectoryName(NickFile)); File.WriteAllText(NickFile, n); } catch { }
                ShowNick(n);
            }
            NickPanel.Visibility = Visibility.Collapsed;
        }

        // ---- меню ----
        void Tab_Click(object s, RoutedEventArgs e) { Pick((string)((Button)s).Tag); }
        void Pick(string k)
        {
            cur = k; Desc.Text = T[k][0];
            foreach (var b in Tabs.Children.OfType<Button>())
                b.Foreground = (string)b.Tag == k ? (Brush)FindResource("Acc") : new SolidColorBrush(Color.FromRgb(0x8F, 0x98, 0xAE));
            var fade = new System.Windows.Media.Animation.DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(220));
            Desc.BeginAnimation(UIElement.OpacityProperty, fade);
        }

        // ---- проверка связи ----
        async Task Check()
        {
            S1.Text = "Подключение…"; S2.Text = "Статус: —"; GoText.Text = "Подождите…"; Go.IsEnabled = false;
            var sw = Stopwatch.StartNew();
            try { using (var r = await Http.GetAsync(BASE + "launcher.html")) { sw.Stop(); online = (int)r.StatusCode < 500; } }
            catch { online = false; }
            S1.Text = online ? "Подключено · " + sw.ElapsedMilliseconds + " мс" : "Нет связи с сервером";
            S2.Text = online ? "Статус: Онлайн" : "Статус: Офлайн";
            GoText.Text = online ? "Запустить" : "Повторить";
            Go.IsEnabled = true;
        }

        // ---- запуск ----
        async void Go_Click(object s, RoutedEventArgs e)
        {
            if (busy) return;
            if (!online) { await Check(); return; }
            busy = true; GoText.Text = "Загрузка…";
            var tcs = new TaskCompletionSource<bool>();
            var fillAnim = new System.Windows.Media.Animation.DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(1500));
            System.Windows.Media.Animation.Timeline.SetDesiredFrameRate(fillAnim, 30);
            fillAnim.Completed += (a, b) => tcs.TrySetResult(true);
            FillScale.BeginAnimation(ScaleTransform.ScaleXProperty, fillAnim);
            await tcs.Task;
            GoText.Text = "Готово";
            Open(cur == "dc" ? DC : BASE + T[cur][1]);
            await Task.Delay(500);
            if (cur == "dc") { FillScale.BeginAnimation(ScaleTransform.ScaleXProperty, null); FillScale.ScaleX = 0; GoText.Text = "Запустить"; busy = false; }
            else Application.Current.Shutdown();
        }

        // сайт открываем окном Edge/Chrome без адресной строки, иначе браузером по умолчанию
        void Open(string url)
        {
            if (url != DC)
            {
                var pf = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
                var pf86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
                var la = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var list = new[]
                {
                    Path.Combine(pf86, @"Microsoft\Edge\Application\msedge.exe"), Path.Combine(pf, @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(pf, @"Google\Chrome\Application\chrome.exe"), Path.Combine(pf86, @"Google\Chrome\Application\chrome.exe"),
                    Path.Combine(la, @"Google\Chrome\Application\chrome.exe")
                };
                foreach (var p in list)
                {
                    if (!File.Exists(p)) continue;
                    try { Process.Start(new ProcessStartInfo(p, "--app=" + url + " --window-size=1280,820") { UseShellExecute = false }); return; } catch { }
                }
            }
            try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch { }
        }
    }
}
