def shorten(number):
    if str(number) != number:
        float = "%.8f" % number
        if len(float) > len(str(number)):
            return str(number)
        else: 
            return float
    else:
        return number


def split_matriz(string):
    return [[float(j) for j in i.split(",")] for i in string.split(";")]


def montar_matriz(matriz):
    espacamento_entre_colunas = 2
    max_length = [espacamento_entre_colunas + max([len(shorten(k[index])) for k in matriz]) for index in
                  range(max([len(i) for i in matriz]))]
    return "\n".join(["[" + "".join(i) + " " * espacamento_entre_colunas + "]" for i in
                      [[" " * (max_length[index] - len(shorten(k[index]))) + shorten(k[index]) for index in range(len(k))] for k
                       in matriz]])


def dimensoes(matriz):
    return [len(matriz), len(matriz[0])]


def mat_quadrada(matriz):
    return dimensoes(matriz)[0] == dimensoes(matriz)[1]


def exportar(matriz):
    return ";".join([",".join([str(j) for j in i]) for i in matriz])


def ler_memoria(indice):
    return Memoria[indice]


def copy_matriz(matriz):
    return [i[:] for i in matriz]


def transposta(matriz):
    return [[matriz[j][i] for j in range(len(matriz))] for i in range(len(matriz[0]))]


def determinante(matriz):
    return escalonamento_parcial(copy_matriz(matriz), matriz_identidade(len(matriz)), True, False, False)


def somar(matriz_1, matriz_2):
    return [[matriz_1[i][j] + matriz_2[i][j] for j in range(len(matriz_1[0]))] for i in range(len(matriz_1))]


def multiplicacao_matricial(matriz_1, matriz_2):
    return colocar_frescuras_na_matriz([
        [sum([matriz_1[l][i] * matriz_2[i][c] for i in range(len(matriz_2))]) for c in range(len(transposta(matriz_2)))]
        for l in range(len(matriz_1))])


def multiplicacao_escalar(matriz, escalar):
    return retirar_zeros_negativos([[float(escalar)*j for j in i] for i in matriz])


def matriz_identidade(grau):
    identidade = []
    for l in range(grau):
        linha = [0.0] * grau
        linha[l] = 1.0
        identidade.append(linha)
    return identidade


def matriz_com_variaveis(linhas, colunas):
    return [["X%i,%i" % (l+1, c+1) for c in range(colunas)] for l in range(linhas)]


def escalonamento_parcial(matriz_a, matriz_b, escalonar_abaixo, mostrar_passos, incognita_precede):
    """Serve para escalonar a porcao, seja abaixo ou acima, da diagonal principal da matriz_a, assim
    como retorna o determinante da matriz"""
    grau_range = None
    dimensoes_a = dimensoes(matriz_a)
    dimensoes_b = dimensoes(matriz_b)
    _determinante = 1
    coluna_sem_pivot = False
    if escalonar_abaixo:
        grau_range = range(min(dimensoes_a))
    else:
        grau_range = range(min(dimensoes_a) - 1, -1, -1)

    for coluna_pivot in grau_range:

        pivot = matriz_a[coluna_pivot][coluna_pivot]

        if pivot == 0.0:
            linha_teste = coluna_pivot + 1
            while True:
                # Se houver uma coluna sem pivot em uma matriz escalonada reduzida, o determinante dela é nulo:
                if linha_teste == dimensoes_a[1]:
                    coluna_sem_pivot = True
                    break
                possivel_novo_pivot = matriz_a[linha_teste][coluna_pivot]
                if possivel_novo_pivot != 0.0:
                    break
                linha_teste += 1

            if not coluna_sem_pivot:
                nova_linha_copy = matriz_a[linha_teste][:]
                antiga_linha_copy = matriz_a[coluna_pivot][:]

                matriz_a[coluna_pivot] = nova_linha_copy
                matriz_a[linha_teste] = antiga_linha_copy

                nova_linha_inversa = matriz_b[linha_teste][:]
                antiga_linha_inversa = matriz_b[coluna_pivot][:]

                matriz_b[coluna_pivot] = nova_linha_inversa
                matriz_b[linha_teste] = antiga_linha_inversa

                pivot = matriz_a[coluna_pivot][coluna_pivot]

                _determinante *= -1

        if not coluna_sem_pivot:
            if pivot != 1.0:
                for index in range(dimensoes_a[1]):
                    matriz_a[coluna_pivot][index] /= pivot
                for index in range(dimensoes_b[1]):
                    matriz_b[coluna_pivot][index] /= pivot

                _determinante *= pivot

                if mostrar_passos:
                    exibicao_passos_resolver_equacao_matricial(matriz_a, matriz_b, pivot, coluna_pivot+1, coluna_pivot+1, incognita_precede, None)

                pivot = matriz_a[coluna_pivot][coluna_pivot]

            index_range = None
            if escalonar_abaixo:
                index_range = range(dimensoes_a[0] - coluna_pivot - 1)
            else:
                index_range = range(coluna_pivot - 1, -1, -1)

            for index in index_range:
                index_vertical = None
                if escalonar_abaixo:
                    index_vertical = index + coluna_pivot + 1
                else:
                    index_vertical = index
                elemento = matriz_a[index_vertical][coluna_pivot]
                fator_de_eliminacao = -elemento / pivot

                for elemento_horizontal in range(dimensoes_a[1]):
                    matriz_a[index_vertical][elemento_horizontal] = \
                        matriz_a[index_vertical][elemento_horizontal] + \
                        fator_de_eliminacao * matriz_a[coluna_pivot][elemento_horizontal]

                for elemento_horizontal in range(dimensoes_b[1]):
                    matriz_b[index_vertical][elemento_horizontal] = \
                        matriz_b[index_vertical][elemento_horizontal] + \
                        fator_de_eliminacao * matriz_b[coluna_pivot][elemento_horizontal]

                if mostrar_passos:
                    exibicao_passos_resolver_equacao_matricial(matriz_a, matriz_b, fator_de_eliminacao, coluna_pivot+1, index_vertical+1, incognita_precede, None)
    if coluna_sem_pivot: return 0.0
    else: return arredondamento_na_raca(_determinante, 6)


def encontrar_solucao_para_equacao_matricial(matriz_a, matriz_b, incognita_precede, modo_detalhado):
    """Resolve o sistema A * X = B, quando a incognita procede a matriz A conhecida, ou o sistema X * A = B, quando a incognita precede a matriz A conhecida."""
    matriz_a_copy = copy_matriz(matriz_a)
    matriz_x = copy_matriz(matriz_b)

    if incognita_precede:
        matriz_a_copy = transposta(matriz_a_copy)
        matriz_x = transposta(matriz_x)

    if modo_detalhado:
        exibicao_passos_resolver_equacao_matricial(matriz_a_copy, matriz_x, None, None, None, incognita_precede, "Equação inicial:\n")

    escalonamento_parcial(matriz_a_copy, matriz_x, True, modo_detalhado, incognita_precede)
    escalonamento_parcial(matriz_a_copy, matriz_x, False, modo_detalhado, incognita_precede)

    tipo_sistema = verificacao_se_solucao_para_equacao_matricial_existe(matriz_a_copy, matriz_x, incognita_precede)

    if tipo_sistema == "SPD":
        matriz_x = redimensionar_matriz_apos_escalonamento(matriz_a, matriz_b, matriz_x, incognita_precede)

        matriz_x = colocar_frescuras_na_matriz(matriz_x)

        if incognita_precede:
            return [transposta(matriz_a_copy), transposta(matriz_x), "SPD"]
        else:
            return [matriz_a_copy, matriz_x, "SPD"]
    elif tipo_sistema == "SI":
        return [matriz_a_copy, matriz_x, "SI"]
    elif tipo_sistema == "SPI":
        return [matriz_a_copy, matriz_x, "SPI"]


def verificacao_se_solucao_para_equacao_matricial_existe(matriz_a, matriz_b, incognita_precede):
    # Se na matriz A houver uma linha completa de elementos nulos e, na mesma linha da matriz B, houver algum elemento não nulo, a expressão é um SPI:
    if len(matriz_a[0]) > len(matriz_a):
        return "SPI"

    for l in range(len(matriz_a)):
        todos_elementos_da_linha_nulos = True
        for c in range(len(matriz_a[0])):
            if matriz_a[l][c] != 0.0: todos_elementos_da_linha_nulos = False
        if todos_elementos_da_linha_nulos:
            for c in range(len(matriz_b[0])):
                if matriz_b[l][c] != 0: return "SI"
            return "SPI"

    # Se, na expressão, houver uma igualdade de um número nulo com um não nulo, ela é um SI:
    if not incognita_precede:
        for l in range(len(matriz_a[0]), len(matriz_b)):
            for c in range(len(matriz_b[0])):
                if matriz_b[l][c] != 0: return "SI"
    else:
        for l in range(len(matriz_b)):
            for c in range(len(matriz_a), len(matriz_b[0])):
                if matriz_b[l][c] != 0: return "SI"
    return "SPD"


def redimensionar_matriz_apos_escalonamento(matriz_a, matriz_b, matriz_x, incognita_precede):
    if incognita_precede:
        return transposta([i[:len(matriz_a)] for i in transposta(matriz_x)][:len(matriz_b)])
    else:
        return [i[:len(matriz_b[0])] for i in matriz_x][:len(matriz_a[0])]


def retirar_zeros_negativos(_matriz):
    nova_matriz = []
    for linha in _matriz:
        nova_linha = []
        for elemento in linha:
            if str(elemento) == "-0.0": nova_linha.append(0.0)
            else: nova_linha.append(elemento)
        nova_matriz.append(nova_linha)
    return nova_matriz


def inversa(matriz, modo_detalhado):
    return encontrar_solucao_para_equacao_matricial(matriz, matriz_identidade(len(matriz)), False, modo_detalhado)[1]


def arredondamento_matriz_na_raca(matriz, precision):
    nova_matriz = []
    for linha in matriz:
        nova_linha = []
        for elemento in linha:
            nova_linha.append(arredondamento_na_raca(elemento, precision))
        nova_matriz.append(nova_linha)
    return nova_matriz


def arredondamento_na_raca(elemento, precision):
    """A precisao define quantos zeros ou noves seguidos apos a virgula a funcao deveria aceitar para que ela arredende o numero"""
    def index_ultimo_digito(string):
        index = 0
        repetitions = 0
        for i in range(len(string)):
            if string[i] != "0" and string[i] != "9":
                repetitions = 0
                index = i
            else:
                repetitions += 1
            if repetitions == precision: return index + 1
        return None

    digits = str(elemento).split(".")[-1]
    if index_ultimo_digito(digits) is not None:
        return round(elemento, index_ultimo_digito(digits))
    else:
        return elemento


def entrada_de_matriz(text):
    if text is None: text = 'Digite as linhas da matriz separadas por ";" e os elementos das linhas separados por ",":\n'
    while True:
        try:
            matriz = str(input(text)).replace(" ", '').lower()
            if matriz.startswith("i"): return matriz_identidade(int(matriz[1:]))
            if matriz.startswith("mem"):
                memoria = ler_memoria(int(matriz[3:]))
                if memoria is not None: return memoria
                else: print("\nMemória %i está vazia.\n" % int(matriz[3:]))
            else: return split_matriz(matriz)
        except Exception:
            print("\nEntrada mal formatada. Digite novamente.\n")


def exibicao_soma(matriz_1, matriz_2, matriz_r):
    def montar_lista_de_linhas_da_matriz(_matriz):
        return montar_matriz(_matriz).split("\n")

    altura_max = len(matriz_1)

    linhas_matriz_1 = montar_lista_de_linhas_da_matriz(matriz_1)
    linhas_matriz_2 = montar_lista_de_linhas_da_matriz(matriz_2)
    linhas_matriz_r = montar_lista_de_linhas_da_matriz(matriz_r)

    for i in range(altura_max):
        if i == int(altura_max / 2):
            soma = "  +  "
            igual = "  =  "
        else:
            soma = "     "
            igual = "     "
        print(linhas_matriz_1[i] + soma + linhas_matriz_2[i] + igual + linhas_matriz_r[i])


def exibicao_multiplicacao_matricial(matriz_1, matriz_2, matriz_p):
    def montar_lista_de_linhas_da_matriz(matriz):
        matriz_montada = montar_matriz(matriz).split("\n")
        linha_vazia = [" " * max([len(f) for f in matriz_montada])]
        linhas_vazias_abaixo = int((altura_max - len(matriz_montada)) / 2)
        linhas_vazias_acima = altura_max - linhas_vazias_abaixo - len(matriz_montada)
        return linha_vazia * linhas_vazias_acima + matriz_montada + linha_vazia * linhas_vazias_abaixo

    altura_max = len(max(matriz_1, matriz_2, matriz_p, key=len))

    linhas_matriz_1 = montar_lista_de_linhas_da_matriz(matriz_1)
    linhas_matriz_2 = montar_lista_de_linhas_da_matriz(matriz_2)
    linhas_matriz_p = montar_lista_de_linhas_da_matriz(matriz_p)

    for i in range(altura_max):
        if i == int(altura_max / 2):
            times = "  *  "
            equal = "  =  "
        else:
            times = "     "
            equal = "     "
        print(linhas_matriz_1[i] + times + linhas_matriz_2[i] + equal + linhas_matriz_p[i])


def exibicao_multiplicacao_escalar(matriz, escalar, matriz_p):
    def montar_lista_de_linhas_da_matriz(_matriz):
        return montar_matriz(_matriz).split("\n")

    altura_max = len(matriz)
    comprimento_escalar = len(str(escalar))

    linhas_matriz_a = montar_lista_de_linhas_da_matriz(matriz)
    linhas_matriz_b = montar_lista_de_linhas_da_matriz(matriz_p)

    for i in range(altura_max):
            if i == int(altura_max / 2):
                space_before = "%s * " % escalar
                space_after = "  =  "
            else:
                space_before = "   " + " "*comprimento_escalar
                space_after = "     "
            print(space_before + linhas_matriz_a[i] + space_after + linhas_matriz_b[i])


def exibicao_inverso(matriz, _inversa):
    def montar_lista_de_linhas_da_matriz(_matriz):
        return montar_matriz(_matriz).split("\n")

    altura_max = len(matriz)

    linhas_matriz = montar_lista_de_linhas_da_matriz(matriz)
    linhas_inversa = montar_lista_de_linhas_da_matriz(_inversa)

    for i in range(altura_max):
        if i == 0 and i == int(altura_max / 2):
            space = " -1  =   "
        elif i == 0:
            space = " -1      "
        elif i == int(altura_max / 2):
            space = "     =   "
        else:
            space = "         "
        print(linhas_matriz[i] + space + linhas_inversa[i])


def exibicao_transposto(matriz, _transposta):
    def montar_lista_de_linhas_da_matriz(_matriz):
        matriz_montada = montar_matriz(_matriz).split("\n")
        linha_vazia = [" " * max([len(f) for f in matriz_montada])]
        linhas_vazias_abaixo = int((altura_max - len(matriz_montada)) / 2)
        linhas_vazias_acima = altura_max - linhas_vazias_abaixo - len(matriz_montada)
        return linha_vazia * linhas_vazias_acima + matriz_montada + linha_vazia * linhas_vazias_abaixo

    altura_max = len(max(matriz, _transposta, key=len))

    linhas_matriz = montar_lista_de_linhas_da_matriz(matriz)
    linhas_inversa = montar_lista_de_linhas_da_matriz(_transposta)

    primeira_linha_matriz = None
    for index in range(len(linhas_matriz)):
        if linhas_matriz[index].count("[") == 1:
            primeira_linha_matriz = index
            break

    for i in range(altura_max):
        if i == primeira_linha_matriz and i == int(altura_max / 2):
            space = " t   =   "
        elif i == primeira_linha_matriz:
            space = " t       "
        elif i == int(altura_max / 2):
            space = "     =   "
        else:
            space = "         "
        print(linhas_matriz[i] + space + linhas_inversa[i])


def exibicao_equacao_resolvida(matriz_a, matriz_b, matriz_x, incognita_precede):
    def montar_lista_de_linhas_da_matriz(matriz):
        matriz_montada = montar_matriz(matriz).split("\n")
        linha_vazia = [" " * max([len(f) for f in matriz_montada])]
        linhas_vazias_abaixo = int((altura_max - len(matriz_montada)) / 2)
        linhas_vazias_acima = altura_max - linhas_vazias_abaixo - len(matriz_montada)
        return linha_vazia * linhas_vazias_acima + matriz_montada + linha_vazia * linhas_vazias_abaixo

    if matriz_a is not None and matriz_b is not None:
        altura_max = len(max(matriz_a, matriz_b, key=len))

        linhas_matriz_a = montar_lista_de_linhas_da_matriz(matriz_a)
        linhas_matriz_b = montar_lista_de_linhas_da_matriz(matriz_b)

        for i in range(altura_max):
            if incognita_precede:
                if i == int(altura_max / 2):
                    space_before = "X * "
                    space_after = "  =  "
                else:
                    space_before = "    "
                    space_after = "     "
                print(space_before + linhas_matriz_a[i] + space_after + linhas_matriz_b[i])
            else:
                if i == int(altura_max / 2):
                    space = " * X  =  "
                else:
                    space = "         "
                print(linhas_matriz_a[i] + space + linhas_matriz_b[i])

    if matriz_a is not None and matriz_b is not None and matriz_x is not None:
        print()

    if matriz_x is not None:
        altura_max = len(matriz_x)

        linhas_matriz_x = montar_lista_de_linhas_da_matriz(matriz_x)

        for i in range(len(matriz_x)):
            if i == int(len(matriz_x) / 2):
                space = "X  =  "
            else:
                space = "      "
            print(space + linhas_matriz_x[i])


def exibicao_passos_resolver_equacao_matricial(matriz_a, matriz_b, fator, index_multiplicado, index_recebido, incognita_precede, texto):
    print()
    if texto is not None: print(texto)
    else:
        if index_multiplicado == index_recebido:
            if not incognita_precede:
                print("1/(%s)*L%i -> L%i\n" % (fator, index_multiplicado, index_recebido))
            else:
                print("1/(%s)*C%i -> C%i\n" % (fator, index_multiplicado, index_recebido))

        else:
            if not incognita_precede:
                print("%s*L%i + L%i -> L%i\n" % (fator, index_multiplicado, index_recebido, index_recebido))
            else:
                print("%s*C%i + C%i -> C%i\n" % (fator, index_multiplicado, index_recebido, index_recebido))

    if incognita_precede:
        exibicao_equacao_resolvida(colocar_frescuras_na_matriz(transposta(matriz_a)), colocar_frescuras_na_matriz(transposta(matriz_b)), None, incognita_precede)
    else:
        exibicao_equacao_resolvida(colocar_frescuras_na_matriz(matriz_a), colocar_frescuras_na_matriz(matriz_b), None, incognita_precede)

    input("\n[Enter] -> Próximo passo\n")


def colocar_frescuras_na_matriz(matriz):
    return arredondamento_matriz_na_raca(retirar_zeros_negativos(copy_matriz(matriz)), 6)


Memoria = [None]*10

Modo_detalhado = False

Matriz = entrada_de_matriz(None)

while True:

    try:
        print()
        print(montar_matriz(Matriz))
        Determinante = None
        if mat_quadrada(Matriz):
            Determinante = determinante(Matriz)
            print("\nO determinante dessa matriz é %s.\n" % Determinante)
        else:
            print("\nMatriz não quadrada não possui determinante.\n")

        if Modo_detalhado:
            option = input(
                "[T] -> Transposta  [I] -> Inversa  [S] -> Soma  [M] -> Multiplicação\n[R] -> Resolver Equação  [N] -> Nova Matriz  [K] -> Salvar  [E] -> Exportar\n[D] -> Desativar modo detalhado\n").lower()
        else:
            option = input(
                "[T] -> Transposta  [I] -> Inversa  [S] -> Soma  [M] -> Multiplicação\n[R] -> Resolver Equação  [N] -> Nova Matriz  [K] -> Salvar  [E] -> Exportar\n[D] -> Ativar modo detalhado\n").lower()
        print()

        if option == "n":
            Matriz = entrada_de_matriz(None)
        else:
            if option == "m":
                escolha = str(input(
                    "Escolha o tipo de multiplicação:\n[1] -> Matricial  [2] -> Escalar\n"))
                print()

                if escolha == "1":
                    escolha_ordem = str(input(
                        "Escolha a ordem da multiplicação:\n[1] -> A * B  [2] -> B * A\n"))
                    print()
                    Matriz_2 = entrada_de_matriz('Digite a matriz B, na mesma formatação que a primeira:\n')
                    print()
                    if escolha_ordem == "1":
                        if len(transposta(Matriz)) == len(Matriz_2):
                            Matriz_p = multiplicacao_matricial(Matriz, Matriz_2)
                            exibicao_multiplicacao_matricial(Matriz, Matriz_2, Matriz_p)
                            Matriz = Matriz_p
                        else:
                            print(
                                "Tais matrizes não podem ser multiplicadas (nº de colunas da 1ª matriz e no de linhas da 2ª não condizem).")
                    elif escolha_ordem == "2":
                        if len(transposta(Matriz_2)) == len(Matriz):
                            Matriz_p = multiplicacao_matricial(Matriz_2, Matriz)
                            exibicao_multiplicacao_matricial(Matriz_2, Matriz, Matriz_p)
                            Matriz = Matriz_p
                        else:
                            print(
                                "Tais matrizes não podem ser multiplicadas (nº de colunas da 1ª matriz e no de linhas da 2ª não condizem).")

                elif escolha == "2":
                    Escalar = input("Digite o escalar pelo qual você deseja multiplicar:\n")
                    print()
                    Resultado = multiplicacao_escalar(Matriz, Escalar)
                    exibicao_multiplicacao_escalar(Matriz, Escalar, Resultado)
                    Matriz = Resultado
            elif option == "d":
                Modo_detalhado = not Modo_detalhado
                if Modo_detalhado: print("Modo detalhado ativado.")
                else: print("Modo detalhado desativado.")
            elif option == "s":
                Matriz_2 = entrada_de_matriz('Digite a segunda matriz, na mesma formatação que a primeira:\n')
                print()
                if dimensoes(Matriz) == dimensoes(Matriz_2):
                    Soma = somar(Matriz, Matriz_2)
                    exibicao_soma(Matriz, Matriz_2, Soma)
                    Matriz = Soma
                else:
                    print("As dimensões das duas matrizes precisam ser iguais para somá-las")
            elif option == "i":
                if not mat_quadrada(Matriz):
                    print("Matriz não quadrada não é invertível.")
                elif Determinante == 0:
                    print("Matriz com determinante 0 não é invertível.")
                else:
                    Inversa = inversa(Matriz, Modo_detalhado)
                    exibicao_inverso(Matriz, Inversa)
                    Matriz = Inversa
            elif option == "t":
                Transposta = transposta(Matriz)
                exibicao_transposto(Matriz, Transposta)
                Matriz = Transposta
            elif option == "r":
                escolha = str(input(
                    "Escolha o tipo de equação:\n[1] -> A * X = B  [2] -> X * A = B\n[3] -> B * X = A  [4] -> X * B = A\n"))
                print()

                if escolha == "1":
                    Incognita_precede = False
                    A_precede_b = True
                elif escolha == "2":
                    Incognita_precede = True
                    A_precede_b = True
                elif escolha == "3":
                    Incognita_precede = False
                    A_precede_b = False
                elif escolha == "4":
                    Incognita_precede = True
                    A_precede_b = False

                Matriz_b = entrada_de_matriz('Digite a matriz B, na mesma formatação que a primeira:\n')
                print()

                Seguir = True

                # Se não há solução, por conta das dimensões das matrizes, faça isso:
                if Incognita_precede and (dimensoes(Matriz)[1] != dimensoes(Matriz_b)[1]):
                    print("Não há solução. As quantidades de colunas em A e B precisam ser iguais.")
                    Seguir = False
                if (not Incognita_precede) and (dimensoes(Matriz)[0] != dimensoes(Matriz_b)[0]):
                    print("Não há solução. As quantidades de linhas em A e B precisam ser iguais.")
                    Seguir = False

                if Seguir:
                    if A_precede_b:
                        Matriz_a_copy = copy_matriz(Matriz)
                        Matriz_b_copy = copy_matriz(Matriz_b)
                    else:
                        Matriz_b_copy = copy_matriz(Matriz)
                        Matriz_a_copy = copy_matriz(Matriz_b)

                    Info_escalonamento_equacao = encontrar_solucao_para_equacao_matricial(Matriz_a_copy, Matriz_b_copy, Incognita_precede, Modo_detalhado)

                    Matriz_a_escalonada = Info_escalonamento_equacao[0]
                    Matriz_x = Info_escalonamento_equacao[1]
                    Tipo_sistema = Info_escalonamento_equacao[2]

                    if Modo_detalhado:
                        print("Resultado final:\n")
                        Matriz_a_copy = None
                        Matriz_b_copy = None

                    if Tipo_sistema == "SPD":
                        exibicao_equacao_resolvida(Matriz_a_copy, Matriz_b_copy, Matriz_x, Incognita_precede)
                    else:
                        if Tipo_sistema == "SI":
                            print("Não há soluções para a expressão dada.\n")
                            exibicao_equacao_resolvida(Matriz_a_copy, Matriz_b_copy, "SI", Incognita_precede)
                        elif Tipo_sistema == "SPI":
                            print("Há infinitas soluções para a expressão dada.\n")
                            exibicao_equacao_resolvida(Matriz_a_copy, Matriz_b_copy, "SPI", Incognita_precede)

                        reduzida = input("\nVocê gostaria de ver a expressão em forma escalonada reduzida?\n[S] -> Sim  [N] -> Não\n").lower()
                        print()
                        if reduzida == "s":
                            exibicao_equacao_resolvida(Matriz_a_escalonada, Matriz_x, None, Incognita_precede)

                    if Matriz_x is not None and Tipo_sistema != "SPI" and Tipo_sistema != "SI": Matriz = Matriz_x

            elif option == "e":
                print(exportar(Matriz))
                print()
            elif option == "k":
                while True:
                    try:
                        escolha = int(input("Escolha o espaço na memória (0-9):\n"))
                        print()
                        Memoria[escolha] = Matriz
                        print('Matriz salva como "mem%i"' % escolha)
                        break
                    except Exception:
                        print("Digite um número de 0 a 9.\n")

            input("\nAperte enter para continuar.")

            print("\n--------------------------------------------------")

    except Exception:
        print("Ocorreu um erro...\nRetornando ao início do programa.\n")

        Matriz = entrada_de_matriz(None)