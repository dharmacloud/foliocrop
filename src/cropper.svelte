<script>
const grabberWidth = 8 , grabberHeight= 8;
export let expanding;
export let x=0;
export let y=0;
export let w=50;
export let h=50;
export let r;
export let caption=''
export let verticalstrip=5;
export let horizontalstrip=17;
export let nframe=0;
export let startExpand;
export let frameidx=0;
export let selected=false;

</script>
<g>
<text {x} y={y-5} class:selected class="caption">{caption}</text>
<text x={x+20} y={y-5} class:selected class="ratio">{(h/w).toFixed(2)}</text>
<text x={x+80} y={y-5} class="pointerpos"> {Math.floor(x/r)},{Math.floor(y/r)}:{Math.floor(w/r)},{ Math.floor(h/r) }</text>

{#each (new Array(verticalstrip)) as strip,idx}
<rect x={x+idx*(w/verticalstrip)} {y} width={(w/verticalstrip) } height={h} class={"vstrip"+((frameidx*verticalstrip+idx)%2)} ></rect>
{/each}

{#each (new Array(horizontalstrip-1)) as strip,idx}
<line x1={x} y1={y+ (idx+1) * (h/(horizontalstrip))} x2={x+w} y2={ y+ (idx+1) * (h/(horizontalstrip))} class="hstrip"></line>
{/each}

<rect {x} {y} width={w} height={h} class="step" on:mousedown={startExpand.bind(this, 'middle', nframe)} class:active={expanding=='middle'}/>

<rect {x} {y} width={grabberWidth} height={h} class="grip" on:mousedown={startExpand.bind(this, 'left', nframe)}  class:active={expanding=='left'}/>
<rect x={x+w-grabberWidth} {y} width={grabberWidth} height={h} class="gripx" on:mousedown={startExpand.bind(this, 'right',nframe)} class:active={expanding=='right'}/>

<rect {x} {y}  width={w} height={grabberHeight} class="grip" on:mousedown={startExpand.bind(this, 'top', nframe)}  class:active={expanding=='top'}/>
<rect {x} y={y+h-grabberHeight} width={w} height={grabberHeight} class="gripy" on:mousedown={startExpand.bind(this, 'bottom', nframe)} class:active={expanding=='bottom'}/>
</g>


<style>
.vstrip1 {
	stroke: rgba(255, 123, 62, 0.8);
	fill:rgba(255,255,255,0)
		/*stroke: rgba(189, 189, 189, 1);*/
}
.vstrip0 {
	stroke: rgba(255, 123, 62, 0.8);
	fill:rgba(255,255,255,0)
}

.step {
	cursor:move;
	fill:rgba(128,128,128,0);
}
.hstrip {
	stroke: rgb(255, 123, 0.8);
	stroke-width: 1;
}
.ratio {
	font: bold 14px courier;
	fill: brown;
	stroke:brown;
}
.pointerpos {
	font: bold 12px courier;
	fill: brown;
	stroke:brown;
}
.caption {
	font: bold 20px courier;
	fill:gray;
	stroke:gray;
}	
.selected {
	/* font: bold 42px courier; */
	fill:rgba(227, 0, 0, 0.865);
	stroke:rgba(227, 0, 0, 0.865);
}

.grip {
	cursor: grabbing;
	fill:rgba(128,96,96,0.5);
}
.gripx {
	cursor: col-resize;
	fill:rgba(128,96,96,0.5);
}
.gripy {
	cursor: row-resize;
	fill:rgba(128,96,96,0.5);
}
.grip.active, .grip:hover {
	fill: #2288;
}
.gripx.active, .gripy.active , .gripx:hover, .gripy:hover{
	fill: rgba(185, 33, 13, 0.533);
}
</style>