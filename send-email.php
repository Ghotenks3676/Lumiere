<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = htmlspecialchars($_POST['nome']);
    $email = htmlspecialchars($_POST['email']);
    $telefone = htmlspecialchars($_POST['telefone']);
    $data_casamento = htmlspecialchars($_POST['data_casamento']);
    $pacote = htmlspecialchars($_POST['pacote']);
    $mensagem = htmlspecialchars($_POST['mensagem']);

    $destino = "contato@lumierefoto.com.br"; // Substitua pelo seu e-mail real
    $assunto = "Novo contato do site - $nome";
    $corpo = "Nome: $nome\n";
    $corpo .= "E-mail: $email\n";
    $corpo .= "Telefone: $telefone\n";
    $corpo .= "Data do casamento: $data_casamento\n";
    $corpo .= "Pacote de interesse: $pacote\n";
    $corpo .= "Mensagem:\n$mensagem\n";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($destino, $assunto, $corpo, $headers)) {
        echo "<script>alert('Mensagem enviada com sucesso! Em breve entraremos em contato.'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Erro ao enviar. Tente novamente mais tarde.'); window.location.href='index.html';</script>";
    }
} else {
    header("Location: index.html");
}
?>