//즉시실행 함수
(() => {

    //window.pageYOffset 대신 쓸 수 변수
    let yOffset = 0;

    //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 높이값의 합
    let prevScrollHeight = 0;

    //현재 활성화 된(눈 앞에 보고 있는) 씬(scroll-section)
    let currentScene = 0;

    //새로운 scne이 시작되는 순간 true
    let enterNewScene = false;



    //기기에 따른 스크롤 section에 따른 배열 생성
    const sceneInfo = [
        {
            type: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-0")
                , messageA: document.querySelector("#scroll-section-0 .main-message.a")
                , messageB: document.querySelector("#scroll-section-0 .main-message.b")
                , messageC: document.querySelector("#scroll-section-0 .main-message.c")
                , messageD: document.querySelector("#scroll-section-0 .main-message.d")
            }
            , values: {
                // messageA_opacity: [200, 900]
                messageA_opacity_in: [0, 1, {
                    //start, end 는 애니메이션이 적용되는 구간을 설정함 (비율로)
                    start: 0.1
                    , end: 0.2
                }]
                //3D효과 타이밍은 opacity와 동일한 시점
                , messageA_translateY_in : [20,0,{start:0.1,end : 0.2}]
                , messageB_opacity_in: [0, 1,{
                    start: 0.3
                    ,end : 0.4
                }]
                //a가 사라지는 시점은 b가 시작되기전에(start) 사라져야 겹치지 않음
                //사라지는 시점은 나타나는게 완료된 이후의 시점(0.2이후)부터
                , messageA_opacity_out: [1, 0
                    , { start: 0.25, end: 0.3 }]
                //아래서 올라왔다가 위로 사라지므로 음수가되어야 위로 올라감
                , messageA_translateY_out: [0, -20, {
                    start:0.25,end:0.3}]
                
            }
        },
        {
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-1")
            }
        },
        {
            type: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-2")
            }
        },
        { 
            type: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-3")
            }
        },
    ];

    function setLayout() {


        //각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
           
            //sticky인 경우에만 높이 조절
            if (sceneInfo[i].type === 'sticky') {
                console.log("스티키")
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                console.log("노말")
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            console.log("else문")
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        //current Scene을 자동 setting
        //현재 스크롤 높이
        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            //전체 scroll 높이
            totalScrollHeight += sceneInfo[i].scrollHeight;

            //for문을 돌면서 섹션의 스크롤 높이의 합보다 현재 스크롤 높이보다 크면 해당하는 페이지 스크롤에서 stop
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }


    function scrollLoop() {

        enterNewScene = false;
        prevScrollHeight = 0;

        //전체 scene의 높이의 합
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        //current scene에 따라서 값 변동
        //현재 스크롤 값이 이전 섹션의 height 값 보다 클 경우 == 다음 section이라는 소리
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            //그럼 현재 페이지  증가
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

            //초기 페이지에서 위로 올렸을 경우 종료
            if (yOffset < prevScrollHeight) {
                return;
            }
        }

        //씬이 바뀌는 찰나의 순간이라면 잠깐 거르기 pass
        if (enterNewScene) return;

        
        playAnimation();
    }


    function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}


    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        //현재 스크롤 높이 - 이전 스크롤들의 높이합  = 각 섹션에서의 높이 값
        const currentYOffset = yOffset - prevScrollHeight;
        //현재씬의 scrollHeight
        const scrollHeight = sceneInfo[currentScene].scrollHeight;

        // 현재씬에서 얼마나 scroll 했는지 / 현재씬의 scrollHeight
        const scrollRatio =currentYOffset / scrollHeight;



        // 스크롤 값에 따라서 해당 타겟의 투명도 조절
        switch (currentScene) {
            case 0:

                //스크롤 전 후 기준점을 임의로 0.22로 잡음 (0.2와 0.25의 중간 값)
                if (scrollRatio <= 0.22) {
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);;
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    //out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out,currentYOffset)}%)`;

                }
                    
                break;
           
            case 2:
                console.log("2")
                break;
            case 3:
                console.log("3")
                break;

        }


    }

    //윈도우 사이즈 조정 시 같이 height 값이 바뀌도록 설정
    window.addEventListener("resize", setLayout);
    window.addEventListener("scroll", () => {
        yOffset = window.pageYOffset;

        scrollLoop();
    });

    window.addEventListener('load', setLayout);

})();