<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>

<head>
    <title>Cometd chat</title>
    <link rel="stylesheet" type="text/css" href="chat.css">
    <script type="text/javascript" src="../../org/cometd.js"></script>
    <script type="text/javascript" src="../../org/cometd/AckExtension.js"></script>
    <script type="text/javascript" src="../../jquery/jquery-1.3.2.js"></script>
    <script type="text/javascript" src="../../jquery/jquery.json-2.2.js"></script>
    <script type="text/javascript" src="../../jquery/jquery.cometd.js"></script>
    <script type="text/javascript" src="chat.js"></script>
    <script type="text/javascript">
        var config = {
            contextPath: '<%=request.getContextPath()%>'
        };
    </script>
</head>

<body>

<h1>Cometd Chat Example</h1>
<h6> <a href="../..">Main Demo index</a> </h6>

<div id="chatroom">
    <div id="chat"></div>
    <div id="members"></div>
    <div id="input">
        <div id="join">
            <table>
                <tbody>
                <tr>
                    <td>
                        <input id="useServer" type="checkbox" />
                    </td>
                    <td>
                        <label for="useServer" title="Selects whether to use cross-domain Cometd">Use Alternate Server</label>
                    </td>
                    <td>
                        <input id="altServer" type="text" value="http://127.0.0.1:8080<%=request.getContextPath()%>/cometd" />
                    </td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        Enter Chat Nickname
                    </td>
                    <td>
                        <input id="username" type="text" />
                    </td>
                    <td>
                        <button id="joinButton" class="button">Join</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div id="joined">
            Chat:
            &nbsp;
            <input id="phrase" type="text" />
            <button id="sendButton" class="button">Send</button>
            <button id="leaveButton" class="button">Leave</button>
        </div>
    </div>
</div>
<br />
<div style="padding: 0.25em;">Tip: Use username[,username2]::text to send private messages</div>

</body>

</html>
