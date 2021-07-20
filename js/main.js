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
                , messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
                , canvas: document.querySelector("#video-canvas-0")
                , context: document.querySelector("#video-canvas-0").getContext('2d')
                //이미지를 담아둘 배열
                , videoImages: []
            }
            , values: {
                //canvas 이미지는 거의 이 scene이 끝나갈 때 없어지게함
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                //이미지 개수
                videoImageCount: 300,
                //이미지 순서
                imageSequence: [0, 299],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        }
        ,{
           // 1
            type: 'normal',
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
       {
        // 2
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-section-2'),
            messageA: document.querySelector('#scroll-section-2 .a'),
            messageB: document.querySelector('#scroll-section-2 .b'),
            messageC: document.querySelector('#scroll-section-2 .c'),
            pinB: document.querySelector('#scroll-section-2 .b .pin'),
            pinC: document.querySelector('#scroll-section-2 .c .pin')  
            ,canvas: document.querySelector("#video-canvas-1"),
            context: document.querySelector("#video-canvas-1").getContext('2d'),
                //이미지를 담아둘 배열
            videoImages: []
        },
           values: {
                //canvas 이미지는 거의 이 scene이 끝나갈 때 없어지게함
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                //이미지 개수
                videoImageCount: 960,
                //이미지 순서
               imageSequence: [0, 959],
             canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
            messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
            messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
            messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
            messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
            messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
            messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
            messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
            messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
            messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
            messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
            pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
        }
    },
    {
        // 3
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-section-3'),
            canvasCaption: document.querySelector('.canvas-caption'),
            canvas: document.querySelector(".image-blend-canvas"),
            context: document.querySelector(".image-blend-canvas").getContext('2d'),
            images : [],
            imagesPath: [
                
                '../images/blend-image-1.jpg'
                ,'../images/blend-image-2.jpg'
            ]
        },
        values: {
            rect1X:[0,0,{start:0, end:0}],
            rect2X:[0,0,{start:0, end:0}]
        }
    }
];

    function setCanvasImages() {
        let imgElem;
        let imgElem2;
        let imgElem3;

        //첫 번째 캔버스 이미지
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image();
            imgElem.src = `video/001/IMG_${6726+i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        //두 번째 캔버스 이미지
         for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++){
            imgElem2 = new Image();
            imgElem2.src = `video/002/IMG_${7027+i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
         } 
        
        
        //세 번째 캔버스 이미지
		for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}

        
    }

    setCanvasImages();

    function setLayout() {


        //각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
           
            //sticky인 경우에만 높이 조절
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
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
  
       
		const heightRatio = window.innerHeight / 1080;

        //캔버스 크기조절
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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

        switch (currentScene) {
            //0번 section
            case 0:
            
                //canvas
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                
                objs.context.drawImage(objs.videoImages[sequence],0,0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                // 스크롤 값에 따라서 해당 타겟의 투명도 조절
                //스크롤 전 후 기준점을 임의로 0.22로 잡음 (0.2와 0.25의 중간 값)
               
				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                    if (scrollRatio <= 0.42) {
                // in
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    }
                  if (scrollRatio <= 0.62) {
                // in
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
            }
            if (scrollRatio <= 0.82) {
                // in
                objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
            }

            break;

            // 1번째 섹션은 효과가 없으므로 case2부터 시작한다.
            case 2:
                //canvas
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
                
             

                if (scrollRatio <= 0.32) {
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)})`;

                } else {
                     // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }


                 if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                 }
                

                if (scrollRatio <= 0.67) {
                // in
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
                
                  if (scrollRatio <= 0.93) {
                // in
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            }

                break;
            case 3:
                //가로세로 모두 꽉 차게 하기 위해 여기서 세팅 ( 계산 필요 )
                //원래 canvas 크기 와 window의 너비 및 높이 비율 계산
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heigthRation = window.innerHeight / objs.canvas.height;
                let canvasScaleRation;

                //비율에 따라서 canvas의 크기 조절
                if (widthRatio <= heigthRation) {
                    //캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRation = heigthRation;
                } else {
                    //캔버스보다 브라우저 창이 납작한 경우 
                    canvasScaleRation = widthRatio;
                }

                // 임의로 캔버스 크기를 화면 크기에 맞춤
                // 확대가 아닌 x의 위치를 계산해줌

                objs.canvas.style.transform = `scale(${canvasScaleRation})`;
                
                // 이미지 배열에 담겨져 있는 첫 번째 이미지를 캔버스로 그린다.
                objs.context.drawImage(objs.images[0], 0, 0);


                //컨버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                //원래 비율(canvas) 찾기

                const recalculatedInnerWidth = window.innerWidth / canvasScaleRation;
                
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRation;

                //캔버스 영역에서 하얀색 캔버스 box그리기 15%짜리 변수 선언
                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                
                //0번은 출발값 (박스들이 처음 setting 된 값)
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                


                //1X의 최종값은 출발점의 폭의 넓이px - 그 출발점의 폭의 넓이만큼 또 빼주면 됨 (왼쪽으로 이동해서 안 보이게끔 해야하므로)
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                

                console.log("values.rect1X[0]", values.rect1X[0]);
                console.log(whiteRectWidth);

                //0번은 출발값 (박스들이 처음 setting 된 값)
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth; 

                //좌우 흰색 박스 그리기
                // x , y , width , height
                objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                

                break;

        }


    }

    //윈도우 사이즈 조정 시 같이 height 값이 바뀌도록 설정
    window.addEventListener("resize", setLayout);
    window.addEventListener("scroll", () => {
        yOffset = window.pageYOffset;

        scrollLoop();
    });

    window.addEventListener('load', () => {
        setLayout();
        //로드가 된다면 미리 이미지가 그려져있는 상태로 유지하기 위해 선언
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    });

})();