@echo off
setlocal
if "%~1"=="" (start "" /min cmd /c "%~f0" run & exit /b)
title 764 CL4N Loader
set "URL=https://young-wave-cd63.764cl4n.workers.dev/"
set "DIR=%LOCALAPPDATA%\764CL4N"
if not exist "%DIR%" mkdir "%DIR%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$t=Get-Content -Raw -LiteralPath '%~f0'; $i=$t.LastIndexOf('::'+'B64:')+6; $b=$t.Substring($i) -replace '[^A-Za-z0-9+/=]',''; [IO.File]::WriteAllBytes('%DIR%\764cl4n.ico',[Convert]::FromBase64String($b))"
set "BR="
if not defined BR if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BR=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BR if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BR=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BR if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BR=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BR if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BR=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BR if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "BR=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not defined BR goto nobr
> "%DIR%\mk.vbs" echo Set s=CreateObject("WScript.Shell")
>> "%DIR%\mk.vbs" echo Set l=s.CreateShortcut(s.SpecialFolders("Desktop") ^& "\764 CL4N Loader.lnk")
>> "%DIR%\mk.vbs" echo l.TargetPath="%BR%"
>> "%DIR%\mk.vbs" echo l.Arguments="--app=%URL%launcher.html --window-size=800,680"
>> "%DIR%\mk.vbs" echo l.IconLocation="%DIR%\764cl4n.ico"
>> "%DIR%\mk.vbs" echo l.Save
cscript //nologo "%DIR%\mk.vbs"
del "%DIR%\mk.vbs"
echo.
echo Done! Shortcut "764 CL4N Loader" is on your Desktop.
start "" "%BR%" --app=%URL%launcher.html --window-size=800,680
timeout /t 4 >nul
exit /b 0
:nobr
echo Microsoft Edge or Google Chrome was not found.
pause
exit /b 1
::B64:
::AAABAAMAEBAAAAAAIAA3AgAANgAAACAgAAAAACAA+AUAAG0CAAAwMAAAAAAgANAIAABlCAAAiVBO
::Rw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/klEQVR4nL2TzUtUURjGf+97zp25Y4yz
::yNSgYgRbKH1rIGVk0QcUKS0skGjTJoMWBUabkHZtgugPiKAIWrkR3BUtihYtBBe1jMIKnBl10jsz
::d+7c0+KaIvRJ0OLhcN7fczic9zyv+H7OGbWorMmIRcVb2/+KqxiERCqJRAwiiorye/7Hxh9z/fsb
::13Nr1GLUSwpYPOvh4sRojIdiMJq8NzmYMM964BSt1SKC5SpRPSaOYb5UBhRVw1I5oBKELH+tUg1C
::GpHDqAWExfmAuAHS13vMDZ09zdTkM2Y/fuH62BXu331Aaa7MuZFBdu/tZvrNO6J6zKcPBd7OvCeX
::y3H52jBTE6/RW+M3aGttxRjDhYvD7NzVRXFukaMn+jnQ38u9Ow/5PFvk1NAAYdigETkGh4+wY892
::Nm/ZhFVVSqUFxm+PsTBfJgzrNGJHvmMrxcICTU1NZPw0vp+mVChz8sxBDh/vYXmpQm9fF3J19KZr
::b2/jyaMJOjs7yee38fTxJC0bW7g0ep6Mn+Hli2kODfRQrdR59XyGShCyb383tWodyaY6nGJJp3zE
::GVysZLPNuFgIqxFGPYymULGkbAprU4izxA3BGg/bnG1e/SIjXtJlJ1jrkcltWBdfEYtiVuK9EmUX
::CzhBUEBwTlbD4mLhO3cuWUETr0v0v2bB/Oss6E/5N3xspoKR/wlLAAAAAElFTkSuQmCCiVBORw0K
::GgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFv0lEQVR4nO2Xa2xcRxXHfzNzfXe99rq7JsGO
::N7bjPBvXcRI3xalN4gRFoFCBogQlQohGIpUKrYSogNLwjMIjUoMItFFRCaoaCRRVAsSnSiAeEhL+
::EFKUh2kejmOnbmzHXu868b737j182LWdtdeJAzWf0NXVXGnOf85/zpn7n3OUx+sXpTQajVIaVTQa
::FBqtSs3NjHreuQfjtSL/QCkDhVIKyL/TjyoeQU+/98NTAq9nAPcYqdmG+cVQ+r5E1QPwSs0lqks6
::YrYjVToicxypBeGniaLQxYwW6mg+ovOkriRRDUqjFxK6/zwi9yNaiEARo0UOfanDqGczWtzQFx9G
::hUaX/j0WK/Rz8XrmF1xcR/OlzprKvzEGrQwigMwYGG1QyiAucxxplccpNCJqGmeMQabWKCKa/9ba
::FGw1WgSMsZi8GyMyMUHOcfMG5J0nk2lik3GYSlRhR8ZYOE6OaGSSaOQu2YyDMXlcPJbCyebyub4n
::IlobcjkhEUuTcyRPbNnSNRIOR9m1ayfLltXwpz/+jcm7cXw+H7HJJI+1PEowGOBfl67hZHJobfKE
::7ySoC9XSse1xyspsznZf5L2BYYLBR1jfsoaRoTDh2xOUldkgecLZtEOwOsCKVXUMDY4THZ+E6qoV
::cvLVUzI8NCL9N27K9d5+CS3ZID6rUT6+Y784jiPhsYisCXVKKPC4rKzplCXeTfL8oe9INHJHrl3p
::l77e9ySbycoXDhyW9vX7RUTk2c8dkYbKXbKxfp+0Lt8nG+r2ycblB+TypX4REXnmMz+Q7c3PirXz
::Y9v50nOHaGvpYmwsQkfnR8jlXJaH6vjZaz+k5+JVkokU4+EJAsEA8ViSjZubOfnLoxw78nNOHHsD
::27Y5fvIwofpanKyLCFzuuYHX60EEjDZEozFeP/NtcjmXiegkfVdv0dq2Bv35gwcYD0c4dvx7/P3s
::28QmE4xER3nrd7/gjdfPMNA/yED/IMl0GsuySMbTPH1oL6O3x3nl5TcJBB7BX+XnWy/8hJ/++DSd
::XW1Ex+8wOhzBtm2MMYyORPn6kYPYHptfn3qbnOMy2D/KpifWoteuW83g4C2+8dJLjI2N892jX+PE
::8e/jusKZX/2ebTva6eu9ic9TjuQEYwwrVzcycON9HMfFtm2S8TRKafzeSlrb1nHtyk0S8RQej03s
::bpKn9m7n4Bc/xdEXT/FkVyvD74exPWU0t65Al5d7uXjhXS71nCOZSGFZFjt3bcPnK+cv3b+hujrA
::3v27qQvVks3mAEV/3yAtrWupXbaUoVtjPLVnB6d/+zLVHwqwcnU9/+juIRFPk045ZDIOew7s5E40
::xqunX+QTn36SUOOH2b2ng6W1Qfjyc4clHk/IO+cuytCtEenaukcaa7ZIw5It8sLzRySbdWTzut1S
::H9wqq2q6pCHQIe2P7ZXrVwdkbDQiF/55RRLxpJz40Wnp2vS0iIiMjkSk53yv9F6+KW+9+QfZXP9Z
::+eijh+ST7V8REZGvPvOK7Ov6poiIKL/dKFs7nmD1qib++udubg+H8VX4SKeyNDU1sLwhxNnu89i2
::Z1qw0imHysoKOru2UFVVyflzV3j3wg0amupoaV2Lx2tjWWUoFKMjUS6904exLLxeD23t6zl/9jo+
::n5f1G5pQtcFmScRTZDIOVX4/Ho8XcfPilEk7ONkcfn9lXrkKF48xFq4jxOMpxFX4fOVUVPjIZlzS
::qQy4GgoKa9s2FRW+vIqKIhnPUFHpA1eRTmVRNYFmMdoqyCOIqOkiU2uD0RauC7OLS601Rlt5tRNV
::wJm8NN9blIpCBBSmIN0W4oIq4C2FQkRwczIDLGg9onBdYebCmrlUZuakSOvdHOgpU2Q6ElP46fVE
::Ia58UPXAw92e/68HZvUFxTn6XxSni9gXLAw/dWDzW/9A+4KFh750X0Apw4dw9AB8ce9YiMBsRv9N
::ub3Q3nHhfcGcHT1k6OfB36sD/wZK2keQO60kLwAAAABJRU5ErkJggolQTkcNChoKAAAADUlIRFIA
::AAAwAAAAMAgGAAAAVwL5hwAACJdJREFUeJztmXtwVcUdxz+7e+4jCcnNBSQNSYSQmITwEoaHVWlT
::hEEQHyNSpQEtAlaoOhYzaEfHkVGsxdYg9VGtqLVYqcJAURStMyKCllpFqwYfASJViORxc9/Pc7Z/
::nJsHVAwOkeAM9697zu5+z+5+v7/f73v2CJc7WwsEQghA0v5fIAGBEJ33TsZ2KQAQdueOjulrITjZ
::22VnR9ENkA31ze3dje95fHl4R45zIt2N73l82XHrW+9Yd9QfLyPHJi15dCCOk/ruxh8vvvg2MXDy
::SkueeOp7Fl+eeOp7Fv8bYuC7pb6n8LvEwImlvqfwjxID3z31PYX/NTFwYqjvKfxuYuDkl5bsLep7
::Cv9774WMjluiC4iQoI9XGulrIZFd+h67dI6t3egIBqkQCFIpEykEDoeBpTXisIVIlFI207oT/Ouo
::l1IipcI0LVKmhVIKh2EAYFl09DlWaYl0X4EETWcMaA1KGUTCUQKBEG63G4fDQVtbAG3qNCNpeAGh
::UJhoJE48njgKI2AoRSwap7XFj2VqsrIyMJSBvy1ENBJHSYUQgmQiRSyawDStwyd+xEKUUiRiSWKR
::BLFYAtPUCCnRGmR5RRk+v49Ro4az8fk17N3/Hu/VbWPF7+8ABFqDEBIpJeFwjBX33c6W155h3abH
::8OZ6MFOWLbn0Q5Uy8PtDnFFezH0P3cYbu55l12eb2f7+szy6ZjkVw0qJRmJEwnEunzudda+sYlb1
::+YQCUZShjmAEDMMgGIgwZvxQnt58N09vXs7M6kkE2yLkerOR+/Y1MGrkCLa8up5pF0xhw4ZNxGNx
::bvjVNSy6bh5+fxC3201zq48bb1rINYvnMm7CmZSWFeNvC2A4VFpONpMBf4gZF5/Hi1uf5KoFMwkF
::w7z4wlZamnxceOkk1m95gGGjyohF40yZfg5jxlWSiCexLJ3eCLrIUBGPJcjL70/t6hpGjy/nzLFl
::pJImsViCMyqKkH5/kJX334MnN4eLp1dTPedypk6axdIly9i+bSceTw7NTa1Mn3Yey+5eyqYNL5NK
::pXj37Q/wB0IYypGevCIWiVNWXsyDq+/E7XZx/YI7qBr7M34x5zaqxlaz9qkXUEoy7qwRuNwuSsqK
::sCyLug/24HI7wdJd0qO9mETCZNUTS7Eszc7tH6K15qP392Eog/Lhg5DnnH0WP6o6m21b32Tf3v3U
::3Hg7I0ZWcl/tw+x65wMsU1NQmM9f/vYgz294hY3rt2AYBv95rw5tpXO0sAMyGo0xf9EVZGZl8MSj
::6/jz6vX07ZtLv/5esrIyufv2R5jyw3k88ccNlFUMZmBhHr6WAAe/bMbpdKLbgxNQhsLXEuTXd13N
::mAkV1FxTS15+P4KBCI1ftJCR4WLoiMHIn0w6F601Awvy2bpjE/fWLuO5jY/z5JN/QGswTYtn1j9C
::MpVi/tVLGDdhNAAf796DwzDQ6UeaKQtPbg4Tq8ahtWbz318jp082AKmkidPpJBFP0tToQ1uawUMK
::UUry6cef4/eF0hnK3n3DMGhtDjCzejLzFl/EnTc/RkP9QQaX5FO/+7/428LkeLMprShClpQOQQiB
::3++nauLFXDBlNsFAiDlXzcLrzeWu395CeXkJk8+dRVPbl4yfcCaplMk/d+xCGQZou26YpoXHk82A
::vP4AtDT5MAzDzhTCzhixaAKXy0kqZVE+rNjeiA/3kognkdJOBEoqwqEYw0aWsPz+X7LmTy9x54rV
::DBtVAsC/ttdxqMlHfkE/igYPQGZmZgCwfFktH+3+hO3bdtLYeIh4PE71lTNZfP089u3dz8zLZ/Dw
::qlVUVJZimiZLbl5IQeEPSCaSHTKyLI1pmqBBYE/a4XCQSplYlmb02EpM08JQisrhpQB8uvtzDMNA
::KYWhFEIKnE4HtY/V4M5wobVF7Yol/HzxDCzLYuTYM5hxybmclufF5XYim5ta0VrTr39fLNooLRtC
::0ekF7PmsgX79+3LwwCEG5PWn5pZFzL92NplZGWitueSyqWirs1o6HE6aD/n4pG4vQgouvWIq4VCU
::lqY2EvEU19XMYcOrD7Dwup9iWZqhw4dgWRbv7KwjEo7T1hok0Bam+as28gtOI9uTxVcHW5k1dwoL
::b7iECROHoy0YPb6MwaUDKRw0wM5c50+epV/6x7MEgyHWPrOeadOmUFg0kGvnL2Xd2ufp268vAkHT
::IR9XXn0ZKx9axv33rmbZrSvxej1o3VlswsEoE6vG8deNK1GG4t2369jfcIDRYysZVDyQ+k/3M++y
::WxFCsO39p2xJvPlhFwmBtjS/ufVxGg+04na7SCZNpJC88FYtfXIyufCsGhrqG3n0uZupOn8Mctvr
::b7FoQQ2NBw8x98rZ+Hx+Fly1hLVrNuJyuQkFw0QiMZLJJF6vhz31n7PjjX8jhOzM2wi0qcnOyWL7
::1ne44qIbefWlHQwpKWT6RT/GTJk8+LunmT3jJuo/2U9hUR4Ne75kX/0XFJcWMHR4MWVDT6e8chAD
::i04j4I8QjyWJRhJEwnGy+mQSDER4/eV3+epAKx5vH6SSNOxpROTlDtXBQIisPllkZGQQCoZJJFLk
::ejwdVdgu7XY11hZoDUqqLl5IdPRTyiAciqIt8HhzMJQiEooTicTJzs7C4XTYhU/bcaOt9jxmj9dp
::NtvtBlp2YQfbs7VvngYxwFOhDcPANDWWqXE4DJQ0sCyLI0+DtSZtwGS64HzdabJASQMhBKmUBdpO
::i4ZhYJn2ZGnfGCEQWiJkp1lsxzoSvz3btW9U+7MMIYRtppA40rag3Vwdaaqk7JzoN7lH2xbYpo60
::Nbc9U9pbCmm7Sy0Q8vDFHw2/Y8Htok0v5LB3YrsSdvcG1V1750K0Jp1S+f923ZnBOKz9WPHt36lz
::oWNv/27wT50L9ba0Tp0L9ba0vvfnQqe+kfWetDpioCek0XvSOvWNrLeldcoL9ba0vvde6H8EOj9O
::RR/osQAAAABJRU5ErkJggg==
